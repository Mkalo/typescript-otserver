export abstract class Protocol {
	static readonly useChecksum: boolean;
}

export class ProtocolLogin extends Protocol {
	static readonly useChecksum: boolean = true;
}
