import { Connection } from "../connection";
import { XTEA } from "../xtea";
import { NetworkMessage, OutputMessage } from "../networkmessage";
import { g_rsa, g_config, g_game} from '../otserv';
import { GameState } from '../enums';

export abstract class Protocol {

	static readonly useChecksum: boolean;
	static readonly serverSendsFirst: boolean;
	static readonly protocolIdentifier: number;
	static readonly protocolName: string;

	protected connection: Connection;
	private xteaKey: XTEA;

	constructor(connection: Connection) {
		this.connection = connection;
	}

	public abstract onRecvFirstMessage(msg: NetworkMessage): void;
	public onConnect(): void {};

	public parsePacket(msg: NetworkMessage): void {
		return;
	};

	public onSendMessage(msg: OutputMessage): void {
		msg.addPacketLength();

		if (this.isEncryptionEnabled()) {
			this.xteaKey.encrypt(msg);
			msg.addHeader();
		}
	}

	public onRecvMessage(msg: NetworkMessage): void {
		// TO DO decrypt stuff...
		return;
	}

	public send(msg: OutputMessage): void {
		if (this.connection)
			return this.connection.send(msg);
	}

	protected disconnect(): void {
		// TODO
	}

	protected isEncryptionEnabled() {
		return !!this.xteaKey;
	}

	protected enableXTEAEncryption(key: Uint32Array): boolean {
		if (!this.xteaKey) {
			this.xteaKey = new XTEA(key);
			return true;
		}
		return false;
	}

	protected decryptRSA(msg: NetworkMessage): boolean {
		const buffer = msg.getBuffer();
		
		if ((buffer.length - msg.getPosition()) < 128) { // rest of packet is to short to be RSA encrypted
			return false;
		}

		g_rsa.decrypt(buffer, msg.getPosition());
		return msg.readByte() === 0;
	}

}
