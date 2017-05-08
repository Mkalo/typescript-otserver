import { Position } from './Position';
import { Cylinder } from './Cylinder';
import { Tile } from './Tile';
import { Item } from './Item';
import { Creature } from './Creature';
import { Container } from './Container';
import { cast } from './utils';

export class Thing {

	public getDescription(lookDistance: number): string {
		return "";
	}

	public getParent(): Cylinder {
		return null;
	}

	public getRealParent(): Cylinder {
		return this.getParent();
	}

	public setParent(cylinder: Cylinder) {
		//
	}

	// public getTile(): Tile { // not sure if this is gonna work
	// 	// return dynamic_cast<Tile*>(this); ///////////////////////////////////////
	// 	// return cast<Tile>(this, Tile);
	// }

	/*
		/\ 
		UGLY HACK TO PREVENT CIRCUAR DEPENDENCY :(
		\/
	*/

	public getPosition(): Position {
		if (this["getPosition"])
			return this["getPosition"]();

		return new Position(0xFFFF, 0xFFFF, 0xFF);
	}

	public getThrowRange(): number {
		return null;
	}

	public isPushable(): boolean {
		return false;
	}

	public getContainer(): Container {
		return null;
	}

	public getItem(): Item {
		return null;
	}

	public getCreature(): Creature {
		return null;
	}

	public isRemoved(): boolean {
		return true;
	}

}
