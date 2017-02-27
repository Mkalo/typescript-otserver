import { createServer, Server, Socket } from "net";
import { Protocol } from "./protocol";
import { NetworkMessage } from "./networkmessage";
import { ServicePort } from "./server";

enum ConnectionState_t {
    CONNECTION_STATE_OPEN,
    CONNECTION_STATE_CLOSED
};

export class ConnectionManager {
    
    private static instance: ConnectionManager = new ConnectionManager();
    protected connections: Array<Connection>;

    protected constructor() {
        this.connections = new Array<Connection>();
    }

    public static getInstance(): ConnectionManager {
        return this.instance;
    }

    public createConnection(server: Server, servicePort: ServicePort): Connection {
        let connection: Connection = new Connection();
        this.connections.push(connection);
        return connection;
    }

    public releaseConnection(connection: Connection): void {
        const find: number = this.connections.indexOf(connection);
        if (find >= 0) {
            this.connections.splice(find, 1);
        }
    }

    public closeAll() : void {
        // TODO
    }
}

export class Connection {
    private connectionState: ConnectionState_t;
    private receivedFirst: boolean;

    private packetsSent: number;
    private timeConnected: number;

    private protocol: Protocol;
    private socket: Socket;

    private messageQueue: Array<NetworkMessage>;
    private servicePort: ServicePort;

    private message: NetworkMessage;

    private hasValidSocket(): boolean {
        return this.socket !== undefined;
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
