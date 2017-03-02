import { XTEA } from "../xtea";
import { NetworkMessage, OutputMessage } from "../networkMessage";
import { g_rsa, g_config, g_game } from '../otserv';
import { GameState } from '../enums';
import { Protocol } from './protocol';
import * as crypto from 'crypto';

export class ProtocolGame extends Protocol {

	static readonly useChecksum: boolean = true;
	static readonly serverSendsFirst: boolean = true;
	static readonly protocolIdentifier: number = 0x00;
	static readonly protocolName: string = "game protocol";

	private challengeTimestamp: number;
	private challengeRandom: number;

	constructor(arg: any) {
		super(arg);

		const randomBytes = crypto.randomBytes(5);
		this.challengeRandom = randomBytes.readUInt8(0);
		this.challengeTimestamp = randomBytes.readUInt32BE(1);
	}

	private disconnectClient(text: string):void {
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

		const operatingSystem = msg.readUInt16();
		const version = msg.readUInt16();

		const clientVersion = msg.readUInt32();
		const clientType = msg.readUInt8();
		const datRevision = msg.readUInt16();

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

		const gmFlag = msg.readUInt8();

		const sessionKey = msg.readString();
		const sessionArgs = sessionKey.split('\n');
		
		if (sessionArgs.length !== 4) {
			return this.disconnect();
		}

		const login = sessionArgs[0];
		const password = sessionArgs[1];
		const token = sessionArgs[2];
		const tokenTime = sessionArgs[3];
		
		const characterName = msg.readString();

		const timeStamp = msg.readUInt32();
		const randomByte = msg.readUInt8();

		if (this.challengeTimestamp !== timeStamp || this.challengeRandom !== randomByte) {
			return this.disconnect();
		}

		if (version < g_game.minClientVersion || version > g_game.maxClientVersion) {
			return this.disconnectClient(`Only clients with protocol ${g_game.clientVersionString} allowed!`);
		}

		if (g_game.getState() == GameState.Startup) {
			return this.disconnectClient("Gameworld is starting up. Please wait.");
		}

		if (g_game.getState() == GameState.Maintain) {
			return this.disconnectClient("Gameworld is under maintenance. Please re-connect in a while.");
		}


		return;
	}

}
