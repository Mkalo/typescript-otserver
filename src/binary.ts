import { NumericType } from "./ctypes";

export class Binary {
    
    private dataBuffer: Buffer;
    private position: number;

    public constructor(data: number | Buffer) {

		if (typeof data === "number") {
			this.dataBuffer = Buffer.alloc(data, 0, "utf8");
			this.position = 0;
		} else if (Buffer.isBuffer(data)) {
			this.dataBuffer = data;
			this.position = 0;
		}
    }

	public setPosition(newPosition: number) {
		this.position = newPosition;
	}

	public getPosition() {
		return this.position;
	}

	protected setBuffer(buffer: Buffer) {
		this.dataBuffer = buffer;
	}

    public getLength(): number {
        return this.dataBuffer.length;
    }

    public getOutputBuffer(): Buffer {
        return this.dataBuffer;
    }

	public canRead(bytes: number): boolean {
		return this.canAdd(bytes);
	}

    public canAdd(bytes: number): boolean {
        return this.position + bytes - 1 < this.dataBuffer.length;
    }

	public readUInt8() {
		if (!this.canRead(1)) throw Error("You are trying to read out of the buffer.");

		const val = this.dataBuffer.readUInt8(this.position);
		this.position += 1;
		return val;
	}

	public readUInt16() {
		if (!this.canRead(2)) throw Error("You are trying to read out of the buffer.");

		const val = this.dataBuffer.readUInt16LE(this.position);
		this.position += 2;
		return val;
	}

	public readUInt32() {
		if (!this.canRead(4)) throw Error("You are trying to read out of the buffer.");

		const val = this.dataBuffer.readUInt32LE(this.position);
		this.position += 4;
		return val;
	}

	public readInt8() {	
		if (!this.canRead(1)) throw Error("You are trying to read out of the buffer.");

		const val = this.dataBuffer.readInt8(this.position);
		this.position += 1;
		return val;
	}

	public readInt16() {
		if (!this.canRead(2)) throw Error("You are trying to read out of the buffer.");

		const val = this.dataBuffer.readInt16LE(this.position);
		this.position += 2;
		return val;
	}

	public readInt32() {
		if (!this.canRead(4)) throw Error("You are trying to read out of the buffer.");

		const val = this.dataBuffer.readInt32LE(this.position);
		this.position += 4;
		return val;
	}

	public readBytes(length: number): Buffer {
		const bytes = [];

		for (let i = 0; i < length; i++) {
			bytes.push(this.readUInt8());
		}

		return new Buffer(bytes);
	}

	public readString() {
		let size: number;
		try {
        	size = this.readUInt16();
		} catch (e) {
			throw Error("You are trying to read out of the buffer.");
		}

        if (!this.canRead(size)) throw Error("You are trying to read out of the buffer.");
		const bytes = this.readBytes(size);
		return bytes.toString();
    }

    public addUInt8(value: number) {
        if (!this.canAdd(1)) {
            return;
        }

        this.position = this.dataBuffer.writeUInt8(NumericType.getUInt8(value), this.position);
    }

    public addUInt16(value: number) {
        if (!this.canAdd(2)) {
            return;
        }

        this.position = this.dataBuffer.writeUInt16LE(NumericType.getUInt16(value), this.position);
    }

    public addUInt32(value: number) {
        if (!this.canAdd(4)) {
            return;
        }

        this.position = this.dataBuffer.writeUInt32LE(NumericType.getUInt32(value), this.position);
    }

    public addInt8(value: number) {
        if (!this.canAdd(1)) {
            return;
        }

        this.position = this.dataBuffer.writeInt8(NumericType.getInt8(value), this.position);
    }

    public addInt16(value: number) {
        if (!this.canAdd(2)) {
            return;
        }

        this.position = this.dataBuffer.writeInt16LE(NumericType.getInt16(value), this.position);
    }

    public addInt32(value: number) {
        if (!this.canAdd(4)) {
            return;
        }

        this.position = this.dataBuffer.writeInt32LE(NumericType.getInt32(value), this.position);
    }

    public addString(value: string) {
        let size: number = value.length;
        if (!this.canAdd(size + 2) || size > 8192) {
            return;
        }

        this.addUInt16(size);
        this.position += this.dataBuffer.write(value, this.position, value.length);
    }

}
