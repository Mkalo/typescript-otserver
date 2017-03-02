import { createServer, Server as TCPServer, Socket } from "net";
import { Connection, ConnectionManager } from "./connection";
import { Protocol } from "./protocols";
import { NetworkMessage } from "./networkMessage"

abstract class ServerBase {

    public abstract isSingleSocket(): boolean;
    public abstract isChecksummed(): boolean;
    public abstract getProtocolIdentifier(): number;
    public abstract getProtocolName(): string;

    public abstract makeProtocol(connection: Connection): Protocol;

}

export class Server<ProtocolType extends Protocol> extends ServerBase {
    
	private protocolType: any;

	constructor(protocolType: typeof Protocol) {
        super();
		this.protocolType = protocolType;
	}

    public isSingleSocket(): boolean {
        return this.protocolType.serverSendsFirst;
    }

	public isChecksummed(): boolean {
		return this.protocolType.useChecksum;
    }

    public getProtocolIdentifier(): number {
        return this.protocolType.protocolIdentifier;
    }

    public getProtocolName(): string {
        return this.protocolType.protocolName;
    }

    public makeProtocol(connection: Connection): Protocol {
        return new this.protocolType(connection);
    }

}

export class ServerPort {
	
    private services: ServerBase[];
    protected ioserver: TCPServer;
    private portOpen: boolean = false;
    private servicePort: number;

    constructor() {
        this.services = [];
    }

    public open(port: number): void {
        this.ioserver = createServer();
        
        this.portOpen = true;
        this.servicePort = port;
    }

    public run(): void {
        if (this.ioserver) {
            this.ioserver.listen(this.servicePort);
            this.accept();
        }
    }

    protected accept(): void {
        if (!this.ioserver) {
            return;
        }

        const connection: Connection = ConnectionManager.getInstance().createConnection(this.ioserver, this);
        this.ioserver.once("connection", (socket) => {
            connection.setSocket(socket);
            this.onAccept(connection);
        });
    }

    public onAccept(connection: Connection): void {
        if (this.services.length == 0) {
            return;
        }
        
        const serviceFront: ServerBase = this.services[0];
        if (serviceFront.isSingleSocket()) {
            connection.accept(serviceFront.makeProtocol(connection));
        } else {
            connection.accept();
        }

        this.accept();
    }

    public close(): void {
        if (this.portOpen && this.ioserver) {
            this.ioserver.close();
        } 
    }

    public isSingleSocket(): boolean {
        for (const service of this.services) {
            if (service.isSingleSocket()) {
                return true;
            }
        }
        return false;
    }

    public getProtocolNames(): string {
        if (this.services.length === 0) {
            return "";
        }

        let ret: string = this.services[0].getProtocolName(); 
        for (let i = 1; i < this.services.length; i++) {
            ret += ", "
            ret += this.services[i].getProtocolName();
        }
        return ret;
    }

    public addService(service: ServerBase): boolean {
        if (this.isSingleSocket()) return false;

        this.services.push(service);
        return true;
    }

    public makeProtocol(connection: Connection, msg: NetworkMessage, checkSummed: boolean): Protocol {
        const protocolId: number = msg.readUInt8();
        for (let service of this.services) {
            if (protocolId !== service.getProtocolIdentifier()) {
                continue;
            }

            if ((checkSummed && service.isChecksummed()) || !service.isChecksummed()) {
			    return service.makeProtocol(connection);
            }
        }
    }
}

export class ServerManager {
    
    private acceptors: Map<number, ServerPort>;
    private running: boolean = false;

    public constructor() {
        this.acceptors = new Map<number, ServerPort>();
    }

    public run(): void {
        this.running = true;
        this.acceptors.forEach((acceptor) => {
            acceptor.run();
        });
    }

    public stop(): void {
        if (!this.running) {
            return;
        }

        this.running = false;
        this.acceptors.forEach((acceptor) => {
            acceptor.close();
        });
    }

    public isRunning(): boolean {
        return this.acceptors.size > 0;
    }

    public addService<ProtocolType extends Protocol>(protocolType: typeof Protocol, port: number): boolean {
        if (port === 0) {
            console.log("ERROR: No port provide for service " + protocolType.name);
            return false;
        }

        let servicePort: ServerPort;
        if (this.acceptors.has(port)) {
            servicePort = this.acceptors.get(port);
            if (servicePort.isSingleSocket() || protocolType.serverSendsFirst) {
                console.log("ERROR: " + protocolType.name + " and " + servicePort.getProtocolNames + " cannot use the same port " + port + ".");
                return false;
            }
        } else {
            servicePort = new ServerPort();
            servicePort.open(port);
            this.acceptors.set(port, servicePort);
        }

        return servicePort.addService(new Server<ProtocolType>(protocolType));
    }
}
