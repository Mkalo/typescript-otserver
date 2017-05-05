import { XTEA } from "../xtea";
import { NetworkMessage, OutputMessage } from "../networkMessage";
import { g_rsa, g_config, g_game } from '../otserv';
import { GameState } from '../enums';
import { Protocol } from './protocol';
import * as crypto from 'crypto';
import { AuthService, IPService } from '../services';
import { Position } from '../Position';
import { Creature } from '../Creature';
import { Player } from '../Player';
import { LightInfo } from '../LightInfo';
import { dumpedMapPacket1, dumpedMapPacket2 } from '../dumpedMapPacket';


class GameClientInfo {
	public operatingSystem: number;
	public version: number;
	public clientVersion: number;
	public clientType: number;
	public datRevision: number;
	public gmFlag: number;
}

export class ProtocolGame extends Protocol {

	static readonly useChecksum: boolean = true;
	static readonly serverSendsFirst: boolean = true;
	static readonly protocolIdentifier: number = 0x00;
	static readonly protocolName: string = "game protocol";

	private challengeTimestamp: number;
	private challengeRandom: number;
	private clientInfo: GameClientInfo;

	private player: Player = null;

	private packetsReadyToSend: OutputMessage[] = [];

	constructor(arg: any) {
		super(arg);

		const randomBytes = crypto.randomBytes(5);
		this.challengeRandom = randomBytes.readUInt8(0);
		this.challengeTimestamp = randomBytes.readUInt32BE(1);
		this.clientInfo = new GameClientInfo();

		setInterval(() => { // for now - later refactor
			if (this.packetsReadyToSend.length === 0)
				return;

			const finalPacket = new OutputMessage();
			for (let singlePacket of this.packetsReadyToSend) { // probably rewrite it in the future for best performance
				for (let val of singlePacket.getBuffer()) {
					finalPacket.addUInt8(val);
				}
			}
			
			this.packetsReadyToSend = [];
			return this.send(finalPacket);
		}, 10);
	}

	private disconnectClient(text: string): void {
		const output = new OutputMessage();
		output.addByte(0x14);
		output.addString(text);
		this.send(output);
		return this.disconnect();
	}

	public onConnect(): void {
		const output = new OutputMessage();

		output.addByte(0x1F);

		output.addUInt32(this.challengeTimestamp);
		output.addByte(this.challengeRandom);

		this.send(output);
	}

	public onRecvFirstMessage(msg: NetworkMessage): void {
		if (g_game.getState() === GameState.Shutdown) {
			return this.disconnect();
		}

		this.clientInfo.operatingSystem = msg.readUInt16();
		this.clientInfo.version = msg.readUInt16();

		this.clientInfo.clientVersion = msg.readUInt32();
		this.clientInfo.clientType = msg.readUInt8();
		this.clientInfo.datRevision = msg.readUInt16();

		if (!this.decryptRSA(msg)) {
			return this.disconnect();
		}

		const key = new Uint32Array(4);
		key[0] = msg.readUInt32();
		key[1] = msg.readUInt32();
		key[2] = msg.readUInt32();
		key[3] = msg.readUInt32();

		const xtea: XTEA = new XTEA(key);
		this.enableXTEAEncryption(key);

		const connectionIP = this.connection.getIp();
		IPService.isBanned(connectionIP, (err) => {
			if (err) return this.disconnectClient(err);

			this.clientInfo.gmFlag = msg.readUInt8();

			const sessionKey = msg.readString();
			const sessionArgs = sessionKey.split('\n');

			if (sessionArgs.length !== 4) {
				return this.disconnect();
			}

			const accountName = sessionArgs[0];
			const password = sessionArgs[1];
			const token = sessionArgs[2];
			const tokenTime = parseInt(sessionArgs[3]);

			const characterName = msg.readString();

			const timeStamp = msg.readUInt32();
			const randomByte = msg.readUInt8();

			if (this.challengeTimestamp !== timeStamp || this.challengeRandom !== randomByte) {
				return this.disconnect();
			}

			if (this.clientInfo.version < g_game.minClientVersion || this.clientInfo.version > g_game.maxClientVersion) {
				return this.disconnectClient(`Only clients with protocol ${g_game.clientVersionString} allowed!`);
			}

			if (g_game.getState() == GameState.Startup) {
				return this.disconnectClient("Gameworld is starting up. Please wait.");
			}

			if (g_game.getState() == GameState.Maintain) {
				return this.disconnectClient("Gameworld is under maintenance. Please re-connect in a while.");
			}

			this.login(accountName, password, characterName, token, tokenTime);
		});
	}

	public parsePacket(msg: NetworkMessage) {
		const buffer = msg.getBuffer();
		msg.skipBytes(2);
		if (g_game.getState() == GameState.Shutdown || msg.getLength() <= 0) {
			return;
		}

		const recvbyte = msg.readUInt8();

		if (!this.player) {
			if (recvbyte === 0x0F) {
				this.disconnect();
			}

			return;
		}

		//a dead player can not performs actions
		if (this.player.isRemoved || (this.player.health < this.player.maxHealth && this.player.health <= 0)) {
			if (recvbyte === 0x0F) {
				return this.disconnect();
			}

			if (recvbyte !== 0x14) {
				return;
			}
		}

		// const buffer = msg.getBuffer();
		// return;
		// msg.skipBytes(2); // packet length
		console.log("Received packet from the client:", recvbyte);
	}

	private login(accountName: string, password: string, characterName: string, token: string, tokenTime: number): void {
		AuthService.getCharactersList(accountName, password, token, async (err, charactersListInfo) => {
			if (err) return this.disconnectClient(err);

			const characters = charactersListInfo.characters;
			const avaiableCharacterNames = characters.map((character) => character.name);
			const characterIndex = avaiableCharacterNames.indexOf(characterName);

			if (characterIndex === -1)
				return this.disconnectClient(`Invalid request.`);

			g_game.getPlayerByName(characterName, (err, player) => {
				if (err) {
					console.error(err);
					return this.disconnectClient(`Somethng went wrong.`);
				}

				if (!player)
					return this.disconnectClient(`Character ${characterName} doesn't exist.`);

				return this.connect(player);
			});
		});
	}

	private connect(player: Player) {
		this.player = player; //??

		if (this.player.isLoggedIn)
			return this.disconnectClient(`You are already logged in.`);

		this.player.setID();
		this.player.isLoggedIn = true;
		// setTimeout(() => {
		// 	this.player.isLoggedIn = false;
		// 	console.log('logged out');
		// 	return this.disconnect();
		// 	// return this.disconnectClient('logged out...');
		// }, 3000);
		this.player.lastLogin = new Date();
		return this.sendAddCreature(this.player, this.player.position, 0, false);
	}

	private sendAddCreature(creature: Creature, pos: Position, stackPos: number, isLogin: boolean): void {
		const msg = new OutputMessage();

		msg.addUInt8(0x17);
		msg.addUInt32(creature.getID()); // playerId
		msg.addUInt16(0x32); // beat duration (50)

		msg.addDouble(Creature.speedA, 3);
		msg.addDouble(Creature.speedB, 3);
		msg.addDouble(Creature.speedC, 3);

		const canReportBugs = true;
		if (canReportBugs) { // can report bugs
			msg.addUInt8(0x01);
		} else {
			msg.addUInt8(0x00);
		}

		msg.addUInt8(0); // can change pvp framing option
		msg.addUInt8(0); // expert mode butto enabled

		msg.addString(''); // URL (string) ingame store images
		msg.addUInt16(25); // TC package size

		this.writeToOutputBuffer(msg);

		this.sendPendingStateEntered();
		this.sendEnterWorld();
		this.sendMapDescription(pos)

		if (isLogin) {
			this.sendMagicEffect(pos, 11);
		}


		// sendInventoryItem

		this.sendStats();
		this.sendSkills();

		//gameworld light-settings
		const lightInfo = new LightInfo;
		// g_game.getWorldLightInfo(lightInfo);
		this.sendWorldLight(lightInfo);

		//player light level
		this.sendCreatureLight(creature);

		this.sendVIPEntries();

		this.sendBasicData();
		// player.sendIcons();
	}

	private canSee(creature: Creature): boolean {
		return true; // for now
	}

	private writeToOutputBuffer(msg: OutputMessage): void {
		this.packetsReadyToSend.push(msg);
	}

	private sendPendingStateEntered(): void {
		const msg = new OutputMessage();
		msg.addUInt8(0x0A);
		this.writeToOutputBuffer(msg);
	}

	private sendEnterWorld(): void {
		const msg = new OutputMessage();
		msg.addUInt8(0x0F);
		this.writeToOutputBuffer(msg);
	}

	private sendMapDescription(pos: Position) {
		const msg = new OutputMessage();
		dumpedMapPacket1.forEach(n => msg.addUInt8(n));
		msg.addUInt32(this.player.getID());
		dumpedMapPacket2.forEach(n => msg.addUInt8(n));
		// msg.addUInt8(0x64);

		// add position
		// msg.addUInt16(pos.x);
		// msg.addUInt16(pos.y);
		// msg.addUInt8(pos.z);

		this.writeToOutputBuffer(msg);
	}

	private sendSkills() {
		const msg = new OutputMessage();

		msg.addByte(0xA1);

		for (let i = 0; i <= 6; ++i) {// for (let i = SKILL_FIRST; i <= SKILL_LAST; ++i) {
			msg.addUInt16(0);// msg.addUInt16(std::min<int32_t>(player ->getSkillLevel(i), std::numeric_limits<uint16_t>::max()));
			msg.addUInt16(0);// msg.addUInt16(player ->getBaseSkill(i));
			msg.addUInt8(0);// msg.addUInt8(player ->getSkillPercent(i));
		}

		// critical chance
		msg.addUInt16(0);
		msg.addUInt16(0);

		// critical damage
		msg.addUInt16(0);
		msg.addUInt16(0);

		// life leech chance
		msg.addUInt16(0);
		msg.addUInt16(0);

		// life leech
		msg.addUInt16(0);
		msg.addUInt16(0);

		// mana leech chance
		msg.addUInt16(0);
		msg.addUInt16(0);

		// mana leech
		msg.addUInt16(0);
		msg.addUInt16(0);
		this.writeToOutputBuffer(msg);
	}

	private sendStats() {
		const msg = new OutputMessage();

		msg.addByte(0xA0);

		msg.addUInt16(this.player.health); // msg.addUInt16(std::min<int32_t>(player ->getHealth(), std::numeric_limits<uint16_t>::max()));
		msg.addUInt16(this.player.maxHealth); // msg.addUInt16(std::min<int32_t>(player ->getMaxHealth(), std::numeric_limits<uint16_t>::max()));

		msg.addUInt32(0); // msg.addUInt32(player ->getFreeCapacity());
		msg.addUInt32(0); // msg.addUInt32(player ->getCapacity());

		msg.addUInt32(0); msg.addUInt32(0); // msg.add<uint64_t>(player ->getExperience());

		msg.addUInt16(0); // msg.addUInt16(player ->getLevel());
		msg.addUInt8(0); // msg.addByte(player ->getLevelPercent());

		msg.addUInt16(100); // base xp gain rate
		msg.addUInt16(0); // xp voucher
		msg.addUInt16(0); // low level bonus
		msg.addUInt16(0); // xp boost
		msg.addUInt16(100); // stamina multiplier (100 = x1.0)

		msg.addUInt16(0); // msg.addUInt16(std::min<int32_t>(player ->getMana(), std::numeric_limits<uint16_t>::max()));
		msg.addUInt16(0); // msg.addUInt16(std::min<int32_t>(player ->getMaxMana(), std::numeric_limits<uint16_t>::max()));

		msg.addUInt8(0); // msg.addByte(std::min<uint32_t>(player ->getMagicLevel(), std::numeric_limits<uint8_t>::max()));
		msg.addUInt8(0); // msg.addByte(std::min<uint32_t>(player ->getBaseMagicLevel(), std::numeric_limits<uint8_t>::max()));
		msg.addUInt8(0); // msg.addByte(player ->getMagicLevelPercent());

		msg.addUInt8(0); // msg.addByte(player ->getSoul());

		msg.addUInt16(0); // msg.addUInt16(player ->getStaminaMinutes());

		msg.addUInt16(0); // msg.addUInt16(player ->getBaseSpeed() / 2);

		// Condition * condition = player ->getCondition(CONDITION_REGENERATION);
		msg.addUInt16(0); // msg.addUInt16(condition ? condition ->getTicks() / 1000 : 0x00);

		msg.addUInt16(0); // msg.addUInt16(player ->getOfflineTrainingTime() / 60 / 1000);

		msg.addUInt16(0); // xp boost time (seconds)
		msg.addByte(0); // enables exp boost in the store

		this.writeToOutputBuffer(msg);
	}

	private sendMagicEffect(pos: Position, effectId: number): void {
		return; // TO DO
	}

	private sendWorldLight(lightInfo: LightInfo) {
		const msg = new OutputMessage();
		msg.addUInt8(0x82);
		msg.addUInt8(lightInfo.level); // if player.isAccessPlayer() 0xFF
		msg.addUInt8(lightInfo.color);
		this.writeToOutputBuffer(msg);
	}

	private sendCreatureLight(creature: Creature): void {
		if (!this.canSee(creature))
			return;

		const msg = new OutputMessage();

		const creatureLight = new LightInfo;
		msg.addUInt8(0x8D);
		msg.addUInt32(creature.getID());
		msg.addUInt8(creatureLight.level); // if player.isAccessPlayer() 0xFF
		msg.addUInt8(creatureLight.color);

		this.writeToOutputBuffer(msg);
	}

	private sendVIPEntries() {
		// TO DO
	}

	private sendBasicData() {
		const msg = new OutputMessage();
		msg.addUInt8(0x9F);
		const isPremium = false;
		if (isPremium) {
			msg.addUInt8(1);
			const premiumDays = 0;
			msg.addUInt32(new Date().getTime() + (premiumDays * 86400));
		} else {
			msg.addUInt8(0);
			msg.addUInt32(0);
		}
		msg.addUInt8(0); // msg.addByte(player ->getVocation() ->getClientId());
		msg.addUInt16(0xFF); // number of known spells
		for (let spellId = 0x00; spellId < 0xFF; spellId++) {
			msg.addUInt8(spellId);
		}
		this.writeToOutputBuffer(msg);
	}

}
