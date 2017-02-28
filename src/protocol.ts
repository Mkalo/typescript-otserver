import { Connection } from "./connection";
import { XTEA } from "./xtea";
import { NetworkMessage, OutputMessage } from "./networkmessage";
import { g_rsa, g_config } from './otserv';
import { GameState } from './enums';

const CLIENT_VERSION_STR = 123; // for now
const CLIENT_VERSION_MIN = 10;
const CLIENT_VERSION_MAX = 30;

const AUTHENTICATOR_DIGITS = 6;
const AUTHENTICATOR_PERIOD = 30;

export abstract class Protocol {

	static readonly useChecksum: boolean;
	static readonly serverSendsFirst: boolean;
	static readonly protocolIdentifier: number;
	static readonly protocolName: string;

	private connection: Connection;
	private xteaKey: XTEA;

	constructor(connection: Connection) {
		this.connection = connection;
	}

	public abstract onRecvFirstMessage(msg: NetworkMessage): void;

	public onConnect(): void {};
	public parsePacket(msg: NetworkMessage): void {};
	public onSendMessage(msg: OutputMessage): void {};
	public onRecvMessage(msg: NetworkMessage): void {}

	public send(msg: OutputMessage): void {
		msg.addPacketLength();

		if (this.isEncryptionEnabled()) {
			this.xteaKey.encrypt(msg);
			msg.addHeader();
		}

		return this.connection.send(msg);
	}

	protected disconnect(): void {
		// TODO
	}

	protected isEncryptionEnabled() {
		return !!this.xteaKey;
	}

	public enableXTEAEncryption(key: Uint32Array): boolean {
		if (!this.xteaKey) {
			this.xteaKey = new XTEA(key);
			return true;
		}
		return false;
	}

}

export class ProtocolLogin extends Protocol {

	static readonly useChecksum: boolean = true;
	static readonly serverSendsFirst: boolean = false;
	static readonly protocolIdentifier: number = 0x01;
	static readonly protocolName: string = "login protocol";

	public disconnectClient(text: string, version: number) {
		const output = new OutputMessage();

		output.addByte(version >= 1076 ? 0x0B : 0x0A);
		output.addString(text);
		this.send(output);

		return this.disconnect();
	}

	private decryptRSA(msg: NetworkMessage): boolean {
		const buffer = msg.getBuffer();
		
		if ((buffer.length - msg.getPosition()) < 128) { // rest of packet is to short to be RSA encrypted
			return false;
		}

		g_rsa.decrypt(buffer, msg.getPosition());
		return msg.readByte() === 0;
	}

	public onRecvFirstMessage(msg: NetworkMessage): void {
		const operatingSytem = msg.readUInt16();
		const version = msg.readUInt16();
		const protocolVersion = msg.readUInt32();
		const datSignature = msg.readUInt32();
		const sprSignature = msg.readUInt32();
		const picSignature = msg.readUInt32();

		msg.skipBytes(1); // 0 byte idk what it is

		const before1stRSA = msg.getPosition();
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

		// if (version < CLIENT_VERSION_MIN || version > CLIENT_VERSION_MAX) {
		// 	return this.disconnectClient(`Only clients with protocol ${CLIENT_VERSION_STR} allowed!`, version);
		// }

		// if (g_game.getGameState() == GameState.Startup) {
		// 	return this.disconnectClient("Gameworld is starting up. Please wait.", version);
		// }

		// if (g_game.getGameState() == GameState.Maintain) {
		// 	return this.disconnectClient("Gameworld is under maintenance.\nPlease re-connect in a while.", version);
		// }


		// BanInfo banInfo;
		// auto connection = getConnection();
		// if (!connection) {
		// 	return;
		// }

		// if (IOBan::isIpBanned(connection.getIP(), banInfo)) {
		// 	if (banInfo.reason.empty()) {
		// 		banInfo.reason = "(none)";
		// 	}

		// 	std::ostringstream ss;
		// 	ss << "Your IP has been banned until " << formatDateShort(banInfo.expiresAt) << " by " << banInfo.bannedBy << ".\n\nReason specified:\n" << banInfo.reason;
		// 	disconnectClient(ss.str(), version);
		// 	return;
		// }

		const accountName = msg.readString();
		if (accountName === "") {
			return this.disconnectClient("Invalid account name.", version);
		}

		const password = msg.readString();
		if (password === "") {
			return this.disconnectClient("Invalid password.", version);
		}

		// read authenticator token and stay logged in flag from last 128 bytes
		
		// msg.setPosition(207);
		// const pos = (msg.getLength() - 128) - msg.getPosition();
		const pos2 = before1stRSA + 128;
		msg.setPosition(pos2);

		msg.readUInt8(); // wtf is this?
		msg.readUInt8(); // wtf is this?

		const hardware1 = msg.readString();
		const hardware2 = msg.readString();

		// console.log("READ POS:", msg.getPosition());
		// console.log(msg.getBuffer().length - 128);

		let authToken = null;
		if (!this.decryptRSA(msg)) {
			// this.disconnectClient("Invalid authentification token.", version);
			// return;
			authToken = "";
		} else {
			authToken = msg.readString();
		}

		this.processLogin(accountName, password, authToken, version);
	}

	private getCharactersListInfo(accountName: string, password: string, authToken, done: Function): void {
		const worlds = g_config.worlds;

		// pull characters from DB when authorizing
		const characters = [
			{
				name: "Noob",
				worldId: 1
			},
			{
				name: "Odsadaa",
				worldId: 0
			},
			{
				name: "Fdfsdgd Fdd",
				worldId: 2
			},
			{
				name: "Lul",
				worldId: 1
			},
			{
				name: "Noob",
				worldId: 1
			}
		];

		const premium = {
			days: 0,
			timeStamp: 0
		};

		return done(null, {
			worlds,
			characters,
			premium
		});
	}

	private addWorldMotd(output: OutputMessage, motd?: string) {
		if (motd) {
			output.addByte(0x14);

			const motdNum = 1;
			output.addString(`${motdNum}\n ${motd}`);
		}
	}

	private addSessionKey(output: OutputMessage, sessionKey: string) {
		output.addByte(0x28);
		output.addString(sessionKey);
	}

	private addCharactersList(output: OutputMessage, worlds: any, characters: any) {
		output.addByte(0x64);

		output.addByte(worlds.length);

		for (let i = 0; i < worlds.length; i++) {
			const world = worlds[i];
			output.addByte(i); // world id
			output.addString(world.name);
			output.addString(world.ip);
			output.addUInt16(world.port);
			output.addByte(world.isPreview || 0);
		}

		output.addByte(characters.length);
		for (let i = 0; i < characters.length; i++) {
			const character = characters[i];
			output.addByte(character.worldId);
			output.addString(character.name);
		}
	}

	private addPremiumInfo(output: OutputMessage, premiumInfo: any) {
		output.addByte(0);
		if (g_config.game.freePremium) {
			output.addByte(1);
			output.addUInt32(0);
		} else {
			output.addByte(premiumInfo.days);
			output.addUInt32(premiumInfo.timeStamp); // premiumdays
		}
	}

	private processLogin(accountName: string, password: string, authToken: string, version: number): void {
		this.getCharactersListInfo(accountName, password, authToken, (err, info) => {
			if (err) return this.disconnectClient("Account name or password is not correct.", version);

			const ticks = new Date().getTime() / AUTHENTICATOR_PERIOD;
			const sessionKey = [accountName, password, authToken, ticks.toString()].join('\n');
			const output = new OutputMessage();

			this.addWorldMotd(output, g_config.game.motd);
			this.addSessionKey(output, sessionKey);
			this.addCharactersList(output, info.worlds, info.characters);
			this.addPremiumInfo(output, info.premium);
			this.send(output);

			return this.disconnect();
		});
	}

}
