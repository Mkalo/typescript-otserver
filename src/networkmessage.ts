import { Binary } from './binary';

export const NETWORKMESSAGE_MAXSIZE = 24590;

export class NetworkMessage extends Binary {

	constructor(bufferOrLength?: Buffer | number) {
		if (typeof bufferOrLength !== "undefined") {
			super(bufferOrLength);
			return;
		}

		super(NETWORKMESSAGE_MAXSIZE);
	}

	public addHeader() {
		throw Error("Not implemented.");
	}

	public addPacketSize() {
		throw Error("Not implemented.");
	}

	public removeHeader() {
		throw Error("Not implemented.");
	}

	public calculateAdler32Checksum() {
		throw Error("Not implemented.");
	}

	public getBuffer(): Buffer {
		const bufferLength = this.getPosition();
		const buffer: Buffer = new Buffer(bufferLength);
		super.getBuffer().copy(buffer, 0, 0, bufferLength);
        return buffer;
    }

    public addPaddingBytes(bytes: number) {
        for (let i = 0; i < bytes; i++) {
            this.addUInt8(0x33);
        }
    }
  
}
