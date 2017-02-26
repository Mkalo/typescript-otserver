import { NumericType } from "./ctypes";

const ON_READ_OUT_OF_THE_BUFFER = "You are trying to read out of the buffer.";
const ON_WRITE_OUT_OF_THE_BUFFER = "You are trying to write out of the buffer.";

export class Binary {

	private dataBuffer: Buffer;
	private position: number;

	constructor(buffer: Buffer);
	constructor(bufferLength: number);
	constructor(p1: any) {
		if (Buffer.isBuffer(p1))
			return this.constructor1(p1);

		if (typeof p1 === "number")
			return this.constructor2(p1);
	}

	private constructor1(buffer: Buffer): Binary {
		this.dataBuffer = buffer;
		this.position = 0;
		return this;
	}

	private constructor2(bufferLength: number): Binary {
		this.dataBuffer = Buffer.alloc(bufferLength, 0, "utf8");
		this.position = 0;
		return this;
	}

	public setPosition(newPosition: number): void {
		this.position = newPosition;
	}

	public getPosition(): number {
		return this.position;
	}

	protected setBuffer(buffer: Buffer): void {
		this.dataBuffer = buffer;
	}

	public getLength(): number {
		return this.dataBuffer.length;
	}

	public getBuffer(): Buffer {
		return this.dataBuffer;
	}

	public canRead(bytes: number): boolean {
		return this.canAdd(bytes);
	}

	public canAdd(bytes: number): boolean {
		return this.position + bytes - 1 < this.dataBuffer.length;
	}

	public readByte(): number {
		if (!this.canRead(1)) throw Error(ON_READ_OUT_OF_THE_BUFFER);

		const val = this.dataBuffer.readUInt8(this.position);
		this.position += 1;
		return val;
	}

	public readBoolean(): boolean {
		if (!this.canRead(1)) throw Error(ON_READ_OUT_OF_THE_BUFFER);

		const val = this.dataBuffer.readUInt8(this.position);
		this.position += 1;
		return !!val;
	}

	public readUInt8(): number {
		if (!this.canRead(1)) throw Error(ON_READ_OUT_OF_THE_BUFFER);

		const val = this.dataBuffer.readUInt8(this.position);
		this.position += 1;
		return val;
	}

	public readUInt16(): number {
		if (!this.canRead(2)) throw Error(ON_READ_OUT_OF_THE_BUFFER);

		const val = this.dataBuffer.readUInt16LE(this.position);
		this.position += 2;
		return val;
	}

	public readUInt32(): number {
		if (!this.canRead(4)) throw Error(ON_READ_OUT_OF_THE_BUFFER);

		const val = this.dataBuffer.readUInt32LE(this.position);
		this.position += 4;
		return val;
	}

	public readInt8(): number {
		if (!this.canRead(1)) throw Error(ON_READ_OUT_OF_THE_BUFFER);

		const val = this.dataBuffer.readInt8(this.position);
		this.position += 1;
		return val;
	}

	public readInt16(): number {
		if (!this.canRead(2)) throw Error(ON_READ_OUT_OF_THE_BUFFER);

		const val = this.dataBuffer.readInt16LE(this.position);
		this.position += 2;
		return val;
	}

	public readInt32(): number {
		if (!this.canRead(4)) throw Error(ON_READ_OUT_OF_THE_BUFFER);

		const val = this.dataBuffer.readInt32LE(this.position);
		this.position += 4;
		return val;
	}

	public readDouble(): number {
		if (!this.canRead(5)) throw Error(ON_READ_OUT_OF_THE_BUFFER);

		const precision = this.readInt8();
		const v = this.readUInt32();
		return (v / (10 ^ precision));
	}

	public readBytes(length: number): Buffer {
		const bytes = [];

		for (let i = 0; i < length; i++) {
			bytes.push(this.readUInt8());
		}

		return new Buffer(bytes);
	}

	public readString(): string {
		let size: number;
		try {
			size = this.readUInt16();
		} catch (e) {
			throw Error(ON_READ_OUT_OF_THE_BUFFER);
		}

		if (!this.canRead(size)) throw Error(ON_READ_OUT_OF_THE_BUFFER);
		const bytes = this.readBytes(size);
		return bytes.toString();
	}

	public addByte(value: number): void {
		if (!this.canAdd(1)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		this.position = this.dataBuffer.writeUInt8(NumericType.getUInt8(value), this.position);
	}

	public addBoolean(value: boolean): void {
		if (!this.canAdd(1)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		const val: number = value ? 1 : 0;

		this.position = this.dataBuffer.writeUInt8(NumericType.getUInt8(val), this.position);
	}

	public addUInt8(value: number): void {
		if (!this.canAdd(1)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		this.position = this.dataBuffer.writeUInt8(NumericType.getUInt8(value), this.position);
	}

	public addUInt16(value: number): void {
		if (!this.canAdd(2)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		this.position = this.dataBuffer.writeUInt16LE(NumericType.getUInt16(value), this.position);
	}

	public addUInt32(value: number): void {
		if (!this.canAdd(4)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		this.position = this.dataBuffer.writeUInt32LE(NumericType.getUInt32(value), this.position);
	}

	public addInt8(value: number): void {
		if (!this.canAdd(1)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		this.position = this.dataBuffer.writeInt8(NumericType.getInt8(value), this.position);
	}

	public addInt16(value: number): void {
		if (!this.canAdd(2)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		this.position = this.dataBuffer.writeInt16LE(NumericType.getInt16(value), this.position);
	}

	public addInt32(value: number): void {
		if (!this.canAdd(4)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		this.position = this.dataBuffer.writeInt32LE(NumericType.getInt32(value), this.position);
	}

	public addDouble(value: number, precision: number): void {
		if (!this.canAdd(5)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		this.addUInt8(precision);
		this.addUInt32(value * (10 ^ precision));
	}

	public addBytes(bytes: Buffer): void {
		const length = bytes.length;
		if (!this.canAdd(length)) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		for (let i = 0; i < length; i++)
			this.addByte(bytes[i]);
	}

	public addString(value: string): void {
		let size: number = value.length;
		if (!this.canAdd(size + 2) || size > 8192) throw Error(ON_WRITE_OUT_OF_THE_BUFFER);

		this.addUInt16(size);
		this.position += this.dataBuffer.write(value, this.position, value.length);
	}
	
}
