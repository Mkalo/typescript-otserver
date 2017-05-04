import { createServer, Server as TCPServer, Socket } from "net";
import { Protocol } from "./protocols";
import { NetworkMessage, OutputMessage } from "./networkMessage";
import { ServerPort } from "./server";

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

	public createConnection(server: TCPServer, servicePort: ServerPort): Connection {
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
		const connections = this.connections;
		const connectionsLength = connections.length;

		for (let i = 0; i < connectionsLength; i++) {
			const connection = connections[i];
			connection.close();
		}
	}
}

export class Connection {
	private connectionState: ConnectionState;
	private receivedFirst: boolean;

	private packetsSent: number;
	private timeConnected: number;

	private protocol: Protocol;
	private socket: Socket;

	private server: TCPServer;

	private messageQueue: OutputMessage[];
	private servicePort: ServerPort;

	constructor(server: TCPServer, servicePort: ServerPort) {
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
			this.socket.setMaxListeners(0);
		}
	}

	public getIp(): string {
		if (this.hasValidSocket()) {
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
			return console.log('invalid checksum'); // temp - not sure why it happens
		}

		if (!this.receivedFirst) {
			this.receivedFirst = true;

			if (!this.protocol) {
				this.protocol = this.servicePort.makeProtocol(this, msg, checksum === recvChecksum);
				if (!this.protocol) {
					return this.close();
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
		// so server doesn't crash when client connection gets closed because of client crash
		this.socket.on('error', err => {
			this.close();
		});

		if (!protocolType) {
			this.socket.on("data", (buffer) => {
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

	public close(): void {
		ConnectionManager.getInstance().releaseConnection(this);
		this.socket.destroy();
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
			this.close();
		}
	}
}
