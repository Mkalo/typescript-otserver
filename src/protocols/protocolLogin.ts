import { XTEA } from "../xtea";
import { NetworkMessage, OutputMessage } from "../networkmessage";
import { g_rsa, g_config, g_game} from '../otserv';
import { GameState } from '../enums';
import { Protocol } from './protocol';

const CLIENT_VERSION_STR = "10"; // for now
const CLIENT_VERSION_MIN = 1;
const CLIENT_VERSION_MAX = 10000;

const AUTHENTICATOR_DIGITS = 6;
const AUTHENTICATOR_PERIOD = 30;

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

	public onRecvFirstMessage(msg: NetworkMessage): void {
		const operatingSytem = msg.readUInt16();
		const version = msg.readUInt16();
		const protocolVersion = msg.readUInt32();
		const datSignature = msg.readUInt32();
		const sprSignature = msg.readUInt32();
		const picSignature = msg.readUInt32();

		msg.skipBytes(1); // 0 byte idk what it is

		const beforeRSA = msg.getPosition();
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

		if (version < CLIENT_VERSION_MIN || version > CLIENT_VERSION_MAX) {
			return this.disconnectClient(`Only clients with protocol ${CLIENT_VERSION_STR} allowed!`, version);
		}

		if (g_game.getState() === GameState.Startup) {
			return this.disconnectClient("Gameworld is starting up. Please wait.", version);
		}

		if (g_game.getState() === GameState.Maintain) {
			return this.disconnectClient("Gameworld is under maintenance.\nPlease re-connect in a while.", version);
		}

		const accountName = msg.readString();
		if (accountName === "") {
			return this.disconnectClient("Invalid account name.", version);
		}

		const password = msg.readString();
		if (password === "") {
			return this.disconnectClient("Invalid password.", version);
		}

		msg.setPosition(beforeRSA + 128);

		msg.readUInt8(); // wtf is this?
		msg.readUInt8(); // wtf is this?

		const hardware1 = msg.readString();
		const hardware2 = msg.readString();

		let authToken = this.decryptRSA(msg) ? msg.readString() : "";

		this.processLogin(accountName, password, authToken, version);
	}

	private getCharactersListInfo(accountName: string, password: string, authToken, done: Function): void {
		const worlds = g_config.worlds;

		// pull characters from DB when authorizing
		const characters = [
			{
				name: "Noob",
				worldId: 0
			},
			{
				name: "Odsadaa",
				worldId: 0
			},
			{
				name: "Fdfsdgd Fdd",
				worldId: 0
			},
			{
				name: "Lul",
				worldId: 0
			},
			{
				name: "Noob",
				worldId: 0
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
		const connectionIP = this.connection.getIp();
		// check ip

		this.getCharactersListInfo(accountName, password, authToken, (err, info) => {
			if (err) return this.disconnectClient(err, version);

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
