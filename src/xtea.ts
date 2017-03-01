import { NumericType } from "./ctypes";
import { NetworkMessage, OutputMessage } from "./networkmessage";

export class XTEA {

	private static readonly delta: number = 0x61C88647;

	private key: Uint32Array;

	public constructor(key: Uint32Array) {
		this.key = new Uint32Array(key);
	}

	public encrypt(msg: OutputMessage): void {
		const paddingBytes: number = msg.getPosition() % 8;
		if (paddingBytes > 0) {
			msg.addPaddingBytes(8 - paddingBytes);
		}

		const buffer: Buffer = msg.getOutputBuffer();
		const messageLength: number = msg.getPosition();
		let readPos: number = 0;
		while (readPos < messageLength) {
			let v0: number = buffer.readUInt32LE(readPos);
			let v1: number = buffer.readUInt32LE(readPos + 4);

			let sum: number = 0;

			for (let i = 32; --i >= 0;) {
				v0 += ((NumericType.getUInt32(v1 << 4) ^ (v1 >>> 5)) + v1) ^ (sum + this.key[sum & 3]);
				v0 = NumericType.getUInt32(v0);
				sum = NumericType.getUInt32(sum - XTEA.delta);
				v1 += ((NumericType.getUInt32(v0 << 4) ^ (v0 >>> 5)) + v0) ^ (sum + this.key[(sum >> 11) & 3]);
				v1 = NumericType.getUInt32(v1);
			}

			buffer.writeUInt32LE(v0, readPos);
			buffer.writeUInt32LE(v1, readPos + 4);
			readPos += 8;
		}
	}

	public decrypt(msg: NetworkMessage): boolean {
		if ((msg.getPosition() & 7) != 0) {
			return false;
		}

		const buffer: Buffer = msg.getBuffer();
		const messageLength: number = msg.getPosition();
		let readPos: number = 0;
		while (readPos < messageLength) {
			let v0: number = buffer.readUInt32LE(readPos);
			let v1: number = buffer.readUInt32LE(readPos + 4);

			let sum: number = 0xC6EF3720;

			for (let i = 32; --i >= 0;) {
				v1 -= ((NumericType.getUInt32(v0 << 4) ^ (v0 >>> 5)) + v0) ^ (sum + this.key[(sum >> 11) & 3]);
				v1 = NumericType.getUInt32(v1);
				sum = NumericType.getUInt32(sum + XTEA.delta);
				v0 -= ((NumericType.getUInt32(v1 << 4) ^ (v1 >>> 5)) + v1) ^ (sum + this.key[sum & 3]);
				v0 = NumericType.getUInt32(v0);
			}

			buffer.writeUInt32LE(v0, readPos);
			buffer.writeUInt32LE(v1, readPos + 4);
			readPos += 8;
		}
	}
    
}
