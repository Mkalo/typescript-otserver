export class Outfit {
	public name: string;
	public lookType: number;
	public addon: number;

	constructor(name: string, lookType: number, addon: number) {
		this.name = name;
		this.lookType = lookType;
		this.addon = addon;
	}
}
