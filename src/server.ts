import * as Net from "net";
import { Protocol } from "./protocol";

export class Service<ProtocolType extends Protocol> {
    
	private protocolType: typeof Protocol;

	public constructor(ProtocolType: typeof Protocol) {
		this.protocolType = ProtocolType;
	}

	public isChecksummed(): boolean {
		return this.protocolType.useChecksum;
	}

}

export class ServicePort {

}
