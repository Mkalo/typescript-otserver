import { Position } from './Position';

export class Town {

	private id: number;
	private name: string;
	private templePosition: Position;

	constructor(townID: number, townName: string, templePosition: Position) {
		this.id = townID;
		this.name = townName;
		this.templePosition = templePosition;
	}

}

export class Towns {

	private towns: Town[];

	constructor() {
		this.towns = [];
	}

	public add(town: Town) {
		this.towns.push(town);
	}

}