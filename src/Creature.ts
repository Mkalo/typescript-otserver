import { Position } from './Position';
import { Outfit } from './Outfit';

export class Creature {
	protected id: number = 0;
	public name: string = '';
	public position: Position = new Position(0, 0, 0);
	public outfit: Outfit = new Outfit("default", 0, 0);

	public health: number = 0;
	public maxHealth: number = 0;

	public static speedA: number = 857.36;
	public static speedB: number = 261.29;
	public static speedC: number = -4795.01;

	public setID(newId: number): void {
		this.id = newId;
	}

	public getID(): number {
		return this.id;
	}
}
