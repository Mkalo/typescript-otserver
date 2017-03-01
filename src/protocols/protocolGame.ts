import { XTEA } from "../xtea";
import { NetworkMessage, OutputMessage } from "../networkMessage";
import { g_rsa, g_config, g_game } from '../otserv';
import { GameState } from '../enums';
import { Protocol } from './protocol';
import * as crypto from 'crypto';

const CLIENT_VERSION_STR = "10"; // for now
const CLIENT_VERSION_MIN = 1;
const CLIENT_VERSION_MAX = 10000;

const AUTHENTICATOR_DIGITS = 6;
const AUTHENTICATOR_PERIOD = 30;

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

	public onConnect() {
		const output = new OutputMessage();

		output.addByte(0x1F);

		output.addUInt32(this.challengeTimestamp);
		output.addByte(this.challengeRandom);

		this.send(output);
	}

	public onRecvFirstMessage(msg: NetworkMessage): void {
		return;
	}

}
