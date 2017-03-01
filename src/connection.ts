import { createServer, Server, Socket } from "net";
import { Protocol } from "./protocols";
import { NetworkMessage, OutputMessage } from "./networkmessage";
import { ServicePort } from "./server";

enum ConnectionState {
    Open,
    Closed
};

export class ConnectionManager {
    
    private static instance: ConnectionManager = new ConnectionManager();
    protected connections: Connection[];

    protected constructor() {
        this.connections = [];
    }

    public static getInstance(): ConnectionManager {
        return this.instance;
    }

    public createConnection(server: Server, servicePort: ServicePort): Connection {
        const connection: Connection = new Connection(server, servicePort);
        this.connections.push(connection);
        return connection;
    }

    public releaseConnection(connection: Connection): void {
        const find: number = this.connections.indexOf(connection);
        if (find >= 0) {
            this.connections.splice(find, 1);
        }
    }

    public closeAll(): void {
        // TODO
    }
}

export class Connection {
    private connectionState: ConnectionState;
    private receivedFirst: boolean;

    private packetsSent: number;
    private timeConnected: number;

    private protocol: Protocol;
    private socket: Socket;

    private server: Server;

    private messageQueue: OutputMessage[];
    private servicePort: ServicePort;

    constructor(server: Server, servicePort: ServicePort) {
        this.connectionState = ConnectionState.Open;
        this.servicePort = servicePort;
        this.server = server;
		this.messageQueue = [];
    }

    private hasValidSocket(): boolean {
        return !!this.socket;
    }
    
    public setSocket(socket: Socket): void {
        if (!this.hasValidSocket()) {
            this.socket = socket;
        }
    }

    public getIp(): string {
        if (this.hasValidSocket) {
            return this.socket.address().address;
        }   
        return "0.0.0.0";
    }

    public parsePacket(msg: NetworkMessage): void {
        if (this.connectionState === ConnectionState.Closed) {
            return;
        }

        const size: number = msg.readUInt16();
        if (size == 0 || size >= NetworkMessage.NETWORKMESSAGE_MAXSIZE - 16) {
            return;
        }

        let checksum: number = 0;
        const length: number = size - NetworkMessage.CHECKSUM_LENGTH;
        const recvChecksum = msg.readUInt32();

        if (length > 0) {
	        checksum = msg.calculateAdler32Checksum(length);
        }

        if (recvChecksum !== checksum) {
            msg.setPosition(msg.getPosition() - 4);
        }

        if (!this.receivedFirst) {
            this.receivedFirst = true;

            if (!this.protocol) {
                this.protocol = this.servicePort.makeProtocol(this, msg, checksum === recvChecksum);
                if (!this.protocol) {
                    // close
                    return;
                }
            } else {
                msg.setPosition(msg.getPosition() + 1);
            }

            this.protocol.onRecvFirstMessage(msg);
        } else {
            this.protocol.onRecvMessage(msg);
        }

        this.accept();
    }

    public accept(protocolType?: Protocol): void {
		//onConnect
        if (!protocolType) {
            this.socket.once("data", (buffer) => {
                const msg = new NetworkMessage(buffer);
                this.parsePacket(msg);
            });
        } else {
            this.protocol = protocolType;
            protocolType.onConnect();
            this.accept();
        }
    }

    public send(msg: OutputMessage): void {
        if (this.connectionState !== ConnectionState.Open) {
            return;
        }

        const noPendingWrite: boolean = this.messageQueue.length === 0;
        this.messageQueue.push(msg);
        if (noPendingWrite) {
            this.internalSend(msg);
        }
    }

    private internalSend(msg: OutputMessage): void {
        this.protocol.onSendMessage(msg);
        this.socket.write(msg.getBuffer(), () => {
            this.onWriteOperation();
        });
    }

    private onWriteOperation(): void {
        this.messageQueue.shift();
        
        if (this.messageQueue.length > 0) {
            this.internalSend(this.messageQueue[0]);
        } else if (this.connectionState == ConnectionState.Closed) {
            // closeSocket();
        }
    }
}
