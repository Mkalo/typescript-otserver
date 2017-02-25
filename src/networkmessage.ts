import { Binary } from './binary';

export const NETWORKMESSAGE_MAXSIZE = 24590;

export class NetworkMessage extends Binary {

    public addPaddingBytes(bytes: number) {
        for (let i = 0; i < bytes; i++) {
            this.addUInt8(0x33);
        }
    }
  
}
