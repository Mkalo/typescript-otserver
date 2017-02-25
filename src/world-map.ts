import { Position } from './position';
import { Item } from './item';

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
	private towns: Array<Town>;

	constructor() {
		this.towns = [];
	}

	public add(town: Town) {
		this.towns.push(town);
	}
}

export class Tile {
	public x: number;
	public y: number;
	public z: number;

	public isProtectionZone: boolean = false;
	public isNoPvpZone: boolean = false;
	public isPvpZone: boolean = false;
	public isNoLogoutZone: boolean = false;
	public isRefreshZone: boolean = false;

	public houseID: number;

	public ground: Item; // for now

	constructor() {

	}

	public addItem(item: Item) {
		// check if item is ground
	}
}

export class WorldMap {
	public description: string;

	private towns: Towns;

	constructor() {
		this.towns = new Towns();
	}

	public addTown(town: Town) {
		this.towns.add(town);
	}

	public setTile(tile: Tile) {

	}
}