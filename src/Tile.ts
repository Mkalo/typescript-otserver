import { Position } from './Position';
import { Item, ItemList } from './Item';

throw Error("TO DO XDD");


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
		if (item.isGround) {
			this.ground = item;
			return;
		}
		// check if item is ground
		this.itemList.addItem(item);
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
