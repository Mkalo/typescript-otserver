import { NumericType } from "./ctypes";
import { Binary } from './binary';

export class NetworkMessage extends Binary {
	public static NETWORKMESSAGE_MAXSIZE: number = 24590;
	public static INITIAL_BUFFER_POSITION: number = 8;
	public static HEADER_LENGTH: number = 2;
	public static CHECKSUM_LENGTH: number = 4;
	public static XTEA_MULTIPLE: number = 8;
	public static MAX_BODY_LENGTH = NetworkMessage.NETWORKMESSAGE_MAXSIZE - NetworkMessage.HEADER_LENGTH - NetworkMessage.CHECKSUM_LENGTH - NetworkMessage.XTEA_MULTIPLE;
	public static MAX_PROTOCOL_BODY_LENGTH = NetworkMessage.MAX_BODY_LENGTH - 10;


	constructor(bufferOrLength?: Buffer | number) {
		if (typeof bufferOrLength !== "undefined") {
			super(bufferOrLength);
			return;
		}

		super(NetworkMessage.NETWORKMESSAGE_MAXSIZE);
	}

	public calculateAdler32Checksum(length: number): number {
		if (length > NetworkMessage.NETWORKMESSAGE_MAXSIZE || !this.canRead(length)) {
			return 0;
		}

		const adler: number = 65521;

		let a: number = 1;
		let b: number = 0;

		const startingPosition: number = this.getPosition();

		while (length > 0) {
			let tmp: number = length > 5552 ? 5552 : length;
			length -= tmp;

			do {
				a += this.readByte() << 0;
				b += a;
			} while (--tmp);

			a %= adler;
			b %= adler;
		}
		this.setPosition(startingPosition);

		return NumericType.getUInt32((b << 16) | a);
	}

	private growBuffer() {
		const spaceToAdd = 20;
		const oldBuffer = this.getBuffer();
		const newBuffer = new Buffer(oldBuffer.length + spaceToAdd);

		oldBuffer.copy(newBuffer);
		this.setBuffer(newBuffer);
	}

	public addPaddingBytes(bytes: number) {
		if (!this.canAdd(bytes)) {
			// const amountOfSpaceAtTheEnd = this.getPosition();
			this.growBuffer(); // bytes
		}

		for (let i = 0; i < bytes; i++) {
			this.addUInt8(0x33);
		}
	}

}

export class OutputMessage extends NetworkMessage {
	public addPacketLength(): void {
		const packetBuffer = this.getBuffer();
		const length = packetBuffer.length;
		const lengthBuffer = new Buffer(2);
		lengthBuffer.writeUInt16LE(length, 0);
		this.insertToFront(lengthBuffer);
		// const length = packetBuffer.length;
		// // const length = this.getLength();
		// const newBuffer = new Buffer(length + 2);

		// packetBuffer.copy(newBuffer, 2, 0, length);
		// newBuffer.writeUInt16LE(length, 0);

		// this.setBuffer(newBuffer);
	}

	private insertToFront(buffer: Buffer): void {
		const packetBuffer = this.getBuffer();
		const length = packetBuffer.length;
		// const length = this.getLength();
		const startOfOldBuffer = buffer.length;

		const newBuffer = new Buffer(length + startOfOldBuffer);

		packetBuffer.copy(newBuffer, startOfOldBuffer, 0, length);
		
		for (let i = 0; i < buffer.length; i++) {
			newBuffer[i] = buffer[i];
		}

		this.setBuffer(newBuffer);
	}

	public getBuffer(): Buffer {
		const bufferLength = this.getPosition();
		const buffer: Buffer = new Buffer(bufferLength);
		super.getBuffer().copy(buffer, 0, 0, bufferLength);
		return buffer;
	}

	public addHeader(): void {
		const length = this.getLength();
		const checksum = this.calculateAdler32Checksum(length);
		const checksumBuffer = new Buffer(4);
		checksumBuffer.writeUInt16LE(checksum, 0);
		this.insertToFront(checksumBuffer);

		this.addPacketLength();
	}
}
