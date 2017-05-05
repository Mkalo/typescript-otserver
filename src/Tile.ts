import { Position } from './Position';
import { Item, ItemList } from './Item';

export class Tile {

	public isProtectionZone: boolean = false;
	public isNoPvpZone: boolean = false;
	public isPvpZone: boolean = false;
	public isNoLogoutZone: boolean = false;
	public isRefreshZone: boolean = false;
	public houseID: number;
	public ground: Item;

	public itemList: ItemList = new ItemList();

	private position: Position;

	public addItem(item: Item) {
		// check if item is ground
	}

	public addThing(item: Item) {

	}

	public setPosition(position: Position): void {
		this.position = position;
	}

	public getPosition(): Position {
		return this.position;
	}

}
