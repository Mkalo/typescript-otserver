import { createServer, Server, Socket } from "net";
import { Protocol } from "./protocol";
import { NetworkMessage } from "./networkmessage";
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
        const connection: Connection = new Connection();
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

    private messageQueue: Array<NetworkMessage>;
    private servicePort: ServicePort;

    private message: NetworkMessage;

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
}
