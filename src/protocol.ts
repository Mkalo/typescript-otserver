import { Connection } from "./connection";
import { XTEA } from "./xtea";
import { NetworkMessage } from "./networkmessage";


export abstract class Protocol {

	static readonly useChecksum: boolean;
    static readonly serverSendsFirst: boolean;
    static readonly protocolIdentifier: number;
    static readonly protocolName: string;

    private connection: Connection;
    private encryptionEnabled: boolean = false;
    private xteaKey: XTEA;


    constructor(connection: Connection) {
        this.connection = connection;
    }

    public abstract parsePacket(msg: NetworkMessage): void;
    public abstract onSendMessage(msg: NetworkMessage): void;
    public abstract onRecvFirstMessage(msg: NetworkMessage): void;
    public abstract onConnect(): void;
    
    public onRecvMessage(msg: NetworkMessage): void {

    }

    public enableXTEAEncryption(): boolean {
        if (this.xteaKey !== undefined) {
            this.encryptionEnabled = true;
            return true;
        }
        return false;
    }

    public setXTEAKey(key: Uint32Array): void {
        this.xteaKey = new XTEA(key);
    }


}

export class ProtocolLogin extends Protocol {

	static readonly useChecksum: boolean = true;
    static readonly serverSendsFirst: boolean = false;
    static readonly protocolIdentifier: number = 0x01;
    static readonly protocolName: string = "login protocol";

    public parsePacket(msg: NetworkMessage): void {

    }

    public onConnect(): void {

    }

    public onRecvFirstMessage(msg: NetworkMessage): void {

    }

    public onSendMessage(): void {

    }
}
