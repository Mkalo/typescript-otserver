import * as Net from "net";
import { Protocol } from "./protocol";

export class Service<ProtocolType extends Protocol> {
	protocolType: typeof Protocol;

	constructor(ProtocolType: typeof Protocol) {
		this.protocolType = ProtocolType;
	}

	is_checksummed(): boolean {
		return this.protocolType.useChecksum;
	}
}

export class ServicePort {

}
