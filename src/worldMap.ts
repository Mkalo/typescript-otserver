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

	private towns: Town[];

	constructor() {
		this.towns = [];
	}

	public add(town: Town) {
		this.towns.push(town);
	}

}

export class Tile {

	public isProtectionZone: boolean = false;
	public isNoPvpZone: boolean = false;
	public isPvpZone: boolean = false;
	public isNoLogoutZone: boolean = false;
	public isRefreshZone: boolean = false;
	public houseID: number;
	public ground: Item;

	private position: Position;

	public addItem(item: Item) {
		// check if item is ground
	}

	public setPosition(position: Position): void {
		this.position = position;
	}

	public getPosition(): Position {
		return this.position;
	}

}

export class WorldMap {

	public description: string;

	private towns: Towns;

	constructor() {
		this.towns = new Towns();
	}

	public addTown(town: Town): void {
		this.towns.add(town);
	}

	public setTile(tile: Tile): void {

	}

}
