import { XTEA } from "../xtea";
import { NetworkMessage, OutputMessage } from "../networkMessage";
import { g_rsa, g_config, g_game } from '../otserv';
import { GameState } from '../enums';
import { Protocol } from './protocol';
import * as crypto from 'crypto';
import { AuthService, IPService } from '../services';
import { Player } from '../objects';

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

	constructor(arg: any) {
		super(arg);

		const randomBytes = crypto.randomBytes(5);
		this.challengeRandom = randomBytes.readUInt8(0);
		this.challengeTimestamp = randomBytes.readUInt32BE(1);
		this.clientInfo = new GameClientInfo();
	}

	private disconnectClient(text: string): void {
		const output = new OutputMessage();
		output.addByte(0x14);
		output.addString(text);
		this.send(output);
		return this.disconnect();
	}

	public onConnect() {
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

	private login(accountName: string , password: string, characterName: string, token: string, tokenTime: number) {
		AuthService.getCharactersList(accountName, password, token, (err, charactersListInfo) => {
			if (err) return this.disconnectClient(err);

			const characters = charactersListInfo.characters;
			const avaiableCharacterNames = characters.map((character) => character.name);
			const characterIndex = avaiableCharacterNames.indexOf(characterName);

			if (characterIndex === -1) {
				return this.disconnectClient(`Character ${characterName} doesn't exist.`);
			}

			g_game.getPlayer(characterName, (err, player: Player) => {
				if (err) return this.disconnectClient(err);

				return this.disconnectClient("Hello " + player.name);
			});
		});
	}

}
