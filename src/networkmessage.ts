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

export class OutputMessage extends NetworkMessage {

}
