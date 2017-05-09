export interface OutfitInterface {
	type: number;
	head: number;
	body: number;
	legs: number;
	feet: number;
	addons: number;
	mount: number;
	lookTypeEx: number;
}

export class Outfit implements OutfitInterface {
	public type: number = 0;
	public head: number = 0;
	public body: number = 0;
	public legs: number = 0;
	public feet: number = 0;
	public addons: number = 0;
	public mount: number = 0;
	public lookTypeEx: number = 0;

	constructor(obj: OutfitInterface = <OutfitInterface>{}) {
		const { type, head, body, legs, feet, addons, mount, lookTypeEx } = obj;
		this.type = type || 136;
		this.head = head || 0;
		this.body = body || 0;
		this.legs = legs || 0;
		this.feet = feet || 0;
		this.addons = addons || 0;
		this.mount = mount || 0;
		this.lookTypeEx = lookTypeEx || 0;
	}
}
