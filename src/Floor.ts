import { Tile } from './Tile';

export const FLOOR_BITS = 3;
export const FLOOR_SIZE = (1 << FLOOR_BITS);
export const FLOOR_MASK = (FLOOR_SIZE - 1);

export class Floor {
	public tiles: Tile[][];

	constructor() {
		this.tiles = [];

		for (let i: number = 0; i < FLOOR_SIZE; i++) {
			this.tiles[i] = [];
			// for (let j: number = 0; j < FLOOR_SIZE; j++) {
			// 	this.things[i][j] = new Thing();
			// }
		}
		// finish 2 dimensional array init
	}
}
