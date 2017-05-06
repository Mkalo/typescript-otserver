import { TileFlag, CylinderFlag, ReturnValue } from './enums';
import { Position } from './Position';
import { Creature } from './Creature';
import { Item } from './Item';
import { Tile } from './Tile';
import { Town, Towns } from './Town';
import { OTBMLoader } from './OTBMLoader';
import { Cylinder } from './Cylinder';
import { Spawn, Spawns } from './Spawn';
import { House, Houses } from './House';
import { Floor, FLOOR_SIZE, FLOOR_MASK, FLOOR_BITS } from './Floor';
import * as deepExtend from 'deep-extend';
import * as shuffleArray from 'shuffle-array';

export const MAP_MAX_LAYERS = 16;

class SpectatorVec { }
class Direction { }
class FrozenPathingConditionCall { }
class FindPathParams { }

class LeafTemplate {
	public child;
	public isLeaf: boolean;
}

class QTreeNode {
	public leaf: boolean = false;
	public child: QTreeNode[] = [];

	public getLeafStatic<T extends LeafTemplate>(node: T, x: number, y: number): T { // WTF is that???
		do {
			node = node.child[((x & 0x8000) >> 15) | ((y & 0x8000) >> 14)];
			if (!node) {
				return null;
			}

			x <<= 1;
			y <<= 1;
		} while (!node.isLeaf);
		return node;
	}

	public getLeaf(x: number, y: number): QTreeLeafNode {
		if (this.isLeaf) {
			return QTreeLeafNode.cast(this); // DUNNO IF THIS WORKS
		}

		const node = this.child[((x & 0x8000) >> 15) | ((y & 0x8000) >> 14)];
		if (!node) {
			return null;
		}
		return node.getLeaf(x << 1, y << 1);
	}

	public createLeaf(x: number, y: number, level: number): QTreeLeafNode {
		if (!this.isLeaf()) {
			const index = ((x & 0x8000) >> 15) | ((y & 0x8000) >> 14);
			if (!this.child[index]) {
				if (level != FLOOR_BITS) {
					this.child[index] = new QTreeNode();
				} else {
					this.child[index] = new QTreeLeafNode();
					QTreeLeafNode.newLeaf = true;
				}
			}
			return this.child[index].createLeaf(x * 2, y * 2, level - 1);
		}
		return QTreeLeafNode.cast(this); // no idea if this works
	}

	public isLeaf(): boolean {
		return this.leaf;
	}
}

class QTreeLeafNode extends QTreeNode {
	static newLeaf: boolean;

	public leafS: QTreeLeafNode = null;
	public leafE: QTreeLeafNode = null;
	public static floors: Floor[] = [];
	public creatureList: Creature[] = [];
	public playerList: Creature[] = [];

	static cast<T>(obj: T): QTreeLeafNode { // NO IDEA IF THIS WORKS
		const _new = new QTreeLeafNode();
		deepExtend(_new, obj);
		return _new;
	}

	public constructor() {
		super();
		this.leaf = true;
		QTreeLeafNode.newLeaf = true;
	}
	// 	~QTreeLeafNode();

	// 	// non-copyable
	// 	QTreeLeafNode(const QTreeLeafNode&) = delete;
	// 	QTreeLeafNode& operator=(const QTreeLeafNode&) = delete;

	public createFloor(z: number): Floor {
		if (!QTreeLeafNode.floors[z]) {
			QTreeLeafNode.floors[z] = new Floor();
		}
		return QTreeLeafNode.floors[z];
	}

	public getFloor(z: number): Floor {
		return QTreeLeafNode.floors[z];
	}

	public addCreature(c: Creature): void {
		this.creatureList.push(c);

		if (c.isPlayer) {
			this.playerList.push(c);
		}
	}

	public removeCreature(c: Creature): void {
		const index = this.creatureList.indexOf(c);
		if (index > -1) {
			this.creatureList.splice(index, 1);
		}

		if (c.isPlayer) {
			const index = this.playerList.indexOf(c);
			if (index > -1) {
				this.playerList.splice(index, 1);
			}
		}
	}
}

export class WorldMap {

	public static maxViewportX: number = 11; //min value: maxClientViewportX + 1
	public static maxViewportY: number = 11; //min value: maxClientViewportY + 1
	public static maxClientViewportX: number = 8;
	public static maxClientViewportY: number = 6;

	public description: string = "";
	public waypoints: Map<string, Position>;

	public spectatorCache;
	public playerSpectatorCache;
	public root: QTreeNode = new QTreeNode();

	public width: number = 0;
	public height: number = 0;

	public towns: Towns = new Towns();
	public houses: Houses = new Houses();
	public spawns: Spawns = new Spawns();

	constructor() {
	}

	public loadMap(fileName: string, loadHouses: boolean): boolean {
		const loader = new OTBMLoader(this);
		if (!loader.load(fileName))
			return false;

		// if (!IOMap::loadSpawns(this)) {
		// 	std::cout << "[Warning - Map::loadMap] Failed to load spawn data." << std::endl;
		// }

		// if (loadHouses) {
		// 	if (!IOMap::loadHouses(this)) {
		// 		std::cout << "[Warning - Map::loadMap] Failed to load house data." << std::endl;
		// 	}

		// 	IOMapSerialize::loadHouseInfo();
		// 	IOMapSerialize::loadHouseItems(this);
		// }

		return true;
	}

	public clean(): number {
		return 0;
	}

	public save(): boolean {
		return true;
	}

	public getTile(x: number, y: number, z: number);
	public getTile(pos: Position);
	public getTile(_x: Position | number, _y?: number, _z?: number): Tile {
		const { x, y, z } = _x instanceof Position ? _x : { x: _x, y: _y, z: _z };
		if (z >= MAP_MAX_LAYERS) {
			return null;
		}

		// const leaf: QTreeLeafNode = QTreeNode.getLeafStatic<const QTreeLeafNode*, const QTreeNode*>(this.root, x, y);
		const leaf = QTreeLeafNode.cast(this.root); // node idea if this works
		if (!leaf) {
			return null;
		}

		const floor: Floor = leaf.getFloor(z);
		if (!floor) {
			return null;
		}
		return floor.tiles[x & FLOOR_MASK][y & FLOOR_MASK];
	}

	public getFloor(z: number): Floor {
		const leaf = QTreeLeafNode.cast(this.root); // node idea if this works
		if (!leaf) {
			return null;
		}

		const floor: Floor = leaf.getFloor(z);
		return floor;
	}

	public setTile(newTile: Tile): void {
		const tilePos: Position = newTile.getPosition();
		if (tilePos.z >= MAP_MAX_LAYERS) {
			console.log(`ERROR: Attempt to set tile on invalid coordinate ${tilePos.toString()}!`);
			return;
		}

		QTreeLeafNode.newLeaf = false;
		const leaf: QTreeLeafNode = this.root.createLeaf(tilePos.x, tilePos.y, 15);

		if (QTreeLeafNode.newLeaf) {
			//update north
			const northLeaf: QTreeLeafNode = this.root.getLeaf(tilePos.x, tilePos.y - FLOOR_SIZE);
			if (northLeaf) {
				northLeaf.leafS = leaf;
			}

			//update west leaf
			const westLeaf: QTreeLeafNode = this.root.getLeaf(tilePos.x - FLOOR_SIZE, tilePos.y);
			if (westLeaf) {
				westLeaf.leafE = leaf;
			}

			//update south
			const southLeaf: QTreeLeafNode = this.root.getLeaf(tilePos.x, tilePos.y + FLOOR_SIZE);
			if (southLeaf) {
				leaf.leafS = southLeaf;
			}

			//update east
			const eastLeaf: QTreeLeafNode = this.root.getLeaf(tilePos.x + FLOOR_SIZE, tilePos.y);
			if (eastLeaf) {
				leaf.leafE = eastLeaf;
			}
		}

		const floor: Floor = leaf.createFloor(tilePos.z);
		const offsetX = tilePos.x & FLOOR_MASK;
		const offsetY = tilePos.y & FLOOR_MASK;

		const tile: Tile = floor.tiles[offsetX][offsetY];
		if (tile) {
			const items = newTile.itemList.getItems();
			if (items) {
				for (let it of items) {
					tile.addThing(it);
				}
				newTile.itemList.clear();
			}

			if (newTile.ground) {
				tile.addThing(newTile.ground);
				newTile.ground = null;
			}
			// delete newTile;
		} else {
			floor.tiles[offsetX][offsetY] = newTile;
			console.log(floor.tiles[offsetX][offsetY]);
			console.log(floor);
			return;
		}
	}

	public placeCreature(centerPos: Position, creature: Creature, extendedPos: boolean = false, forceLogin: boolean = false): boolean {
		let foundTile: boolean;
		let placeInPZ: boolean;

		let tile = this.getTile(centerPos.x, centerPos.y, centerPos.z);
		if (tile) {
			placeInPZ = tile.hasFlag(TileFlag.TILESTATE_PROTECTIONZONE);
			const ret = tile.queryAdd(0, creature, 1, CylinderFlag.FLAG_IGNOREBLOCKITEM);
			foundTile = forceLogin || ret === ReturnValue.RETURNVALUE_NOERROR || ret === ReturnValue.RETURNVALUE_PLAYERISNOTINVITED;
		} else {
			placeInPZ = false;
			foundTile = false;
		}

		if (!foundTile) {
			const relList: Array<{ x: number, y: number }> = (extendedPos ? WorldMap.extendedRelList : WorldMap.normalRelList);

			if (extendedPos) {
				shuffleArray(relList);
				// std::shuffle(relList.begin(), relList.begin() + 4, getRandomGenerator());
				// std::shuffle(relList.begin() + 4, relList.end(), getRandomGenerator());
			} else {
				// std::shuffle(relList.begin(), relList.end(), getRandomGenerator());
				shuffleArray(relList);
			}

			for (let it of relList) {
				const tryPos = new Position(centerPos.x + it.x, centerPos.y + it.y, centerPos.z);

				tile = this.getTile(tryPos.x, tryPos.y, tryPos.z);
				if (!tile || (placeInPZ && !tile.hasFlag(TileFlag.TILESTATE_PROTECTIONZONE))) {
					continue;
				}

				if (tile.queryAdd(0, creature, 1, 0) === ReturnValue.RETURNVALUE_NOERROR) {
					if (!extendedPos || this.isSightClear(centerPos, tryPos, false)) {
						foundTile = true;
						break;
					}
				}
			}

			if (!foundTile) {
				return false;
			}
		}

		let index = 0;
		let flags = 0;
		let toItem: Item = null;

		const toCylinder: Cylinder = tile.queryDestination(index, creature, toItem, flags); // to do
		toCylinder.internalAddThing(creature);

		const dest: Position = toCylinder.getPosition();
		this.getQTNode(dest.x, dest.y).addCreature(creature);
		return true;

	}

	public moveCreature(creature: Creature, newTile: Tile, forceTeleport: boolean = false): void {

	}

	public getSpectators(list: SpectatorVec, centerPos: Position, multifloor: boolean = false, onlyPlayers: boolean = false, minRangeX: number = 0, maxRangeX: number = 0, minRangeY: number = 0, maxRangeY: number = 0): void {

	}

	public clearSpectatorCache(): void {

	}

	public canThrowObjectTo(fromPos: Position, toPos: Position, checkLineOfSight: boolean = true, rangex: Number = WorldMap.maxClientViewportX, rangey: number = WorldMap.maxClientViewportY): boolean {
		return true;
	}

	public isSightClear(fromPos: Position, toPos: Position, floorCheck: boolean): boolean {
		return true;
	}

	public checkSightLine(fromPos: Position, toPos: Position): boolean {
		return true;
	}

	public canWalkTo(creature: Creature, pos: Position): Tile {
		return null;
	}

	public getPathMatching(creature: Creature, dirList: Direction[], pathCondition: FrozenPathingConditionCall, fpp: FindPathParams): boolean {
		return true;
	}

	public getQTNode(x: number, y: number): QTreeLeafNode {
		// return QTreeNode::getLeafStatic < QTreeLeafNode *, QTreeNode *>(&root, x, y);
		return null;
	}

	public getSpectatorsInternal(centerPos: Position, minRangeX: number, maxRangeX: number, minRangeY: number, maxRangeY: number, minRangeZ: number, maxRangeZ: number, onlyPlayers: boolean): SpectatorVec {
		return null;
	}

	public addTown(town: Town): void {
		this.towns.add(town);
	}



	public static extendedRelList: Array<{ x: number, y: number }> = [
		{ x: 0, y: -2 },
		{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
		{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
		{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 },
		{ x: 0, y: 2 }
	];

	public static normalRelList: Array<{ x: number, y: number }> = [
		{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
		{ x: -1, y: 0 }, { x: 1, y: 0 },
		{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
	];

}
