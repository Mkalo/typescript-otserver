import { NumericType } from "./ctypes";
import { Binary, ON_READ_OUT_OF_THE_BUFFER, ON_WRITE_OUT_OF_THE_BUFFER } from './binary';
import { Item } from './Item';
import { FluidMap } from './enums';
import { Position } from './Position';

export class NetworkMessage extends Binary {
	public static NETWORKMESSAGE_MAXSIZE: number = 24590;
	public static INITIAL_BUFFER_POSITION: number = 8;
	public static HEADER_LENGTH: number = 2;
	public static CHECKSUM_LENGTH: number = 4;
	public static XTEA_MULTIPLE: number = 8;
	public static MAX_BODY_LENGTH = NetworkMessage.NETWORKMESSAGE_MAXSIZE - NetworkMessage.HEADER_LENGTH - NetworkMessage.CHECKSUM_LENGTH - NetworkMessage.XTEA_MULTIPLE;
	public static MAX_PROTOCOL_BODY_LENGTH = NetworkMessage.MAX_BODY_LENGTH - 10;


	constructor(noArg?: any);
	constructor(buffer: Buffer);
	constructor(bufferLength: number);
	constructor(p1: any) {
		if (p1 === undefined) {
			super(NetworkMessage.NETWORKMESSAGE_MAXSIZE);
			return;
		}

		super(p1);
	}

	public addItem(item: Item): void {
		if (!this.canAdd(6)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		this.addUInt16(item.itemType.clientID);
		this.addUInt8(0xFF);

		if (item.isStackable()) {
			this.addUInt8(Math.min(0xFF, item.count));
		} else if (item.itemType.isSplash() || item.itemType.fluid) {
			// this.addUInt8(fluidMap[item.getFluidType() & 7]);
			this.addUInt8(FluidMap[0] & 7); // FOR NOW
		}

		if (item.itemType.isAnimated) {
			this.addUInt8(0xFE);
		}
	}

	public readItem(): Item {
		throw Error("TO DO");
	}

	public addPosition(pos: Position): void {
		const { x, y, z } = pos;
		this.addUInt16(x);
		this.addUInt16(y);
		this.addUInt8(z);
	}

	public readPosition(): Position {
		const x = this.readUInt16();
		const y = this.readUInt16();
		const z = this.readUInt8();
		
		return new Position(x, y, z);
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

	public addPaddingBytes(bytes: number) {
		for (let i = 0; i < bytes; i++) {
			this.addUInt8(0x33);
		}
	}

	public getOutputBuffer(): Buffer {
		return super.getBuffer(); /// ? xD
	}

}

export class OutputMessage extends NetworkMessage {
	public addPacketLength(): void {
		const packetBuffer = this.getBuffer();
		const length = packetBuffer.length;
		const lengthBuffer = new Buffer(2);
		lengthBuffer.writeUInt16LE(length, 0);
		this.transformBuffer([lengthBuffer, packetBuffer]);
	}

	public getBuffer(): Buffer {
		const bufferLength = this.getPosition();
		const buffer: Buffer = new Buffer(bufferLength);
		super.getBuffer().copy(buffer, 0, 0, bufferLength);
		return buffer;
	}

	private transformBuffer(buffers: Buffer[]) { // concats buffers and makes output buffer still "dynamic" because it adds extra bytes so final length is NetworkMessage.NETWORKMESSAGE_MAXSIZE
		let buffersLengthSum = 0;

		for (let i = 0; i < buffers.length; i++) {
			const buffer = buffers[i];
			buffersLengthSum += buffer.length;
		}

		this.setPosition(buffersLengthSum);

		const missingBytesToMaxSize = NetworkMessage.NETWORKMESSAGE_MAXSIZE - buffersLengthSum;
		const missingBYtesBuffer = new Buffer(missingBytesToMaxSize);

		buffers.push(missingBYtesBuffer);

		const newBuffer = Buffer.concat(buffers);
		this.setBuffer(newBuffer);
	}

	public addHeader(): void {
		const packetBuffer = this.getBuffer();
		const length = packetBuffer.length;

		const startingPosition: number = this.getPosition();
		this.setPosition(0);
		const checksum = this.calculateAdler32Checksum(length);
		this.setPosition(startingPosition);
		const checksumBuffer = new Buffer(4);
		checksumBuffer.writeUInt32LE(checksum, 0);
		this.transformBuffer([checksumBuffer, packetBuffer]);

		this.addPacketLength();
	}

}
