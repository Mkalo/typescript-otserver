import { Position } from './Position';
import { Creature } from './Creature';
import { Item } from './item';
import { OTBMLoader } from './OTBMLoader';

export const MAP_MAX_LAYERS = 16;

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

class Houses { }
class Spawns { }
class SpectatorVec { }
class Direction { }
class FrozenPathingConditionCall { }
class FindPathParams { }
class QTreeLeafNode { }

export class WorldMap {

	public static maxViewportX: number = 11; //min value: maxClientViewportX + 1
	public static maxViewportY: number = 11; //min value: maxClientViewportY + 1
	public static maxClientViewportX: number = 8;
	public static maxClientViewportY: number = 6;

	public description: string = "";
	public waypoints: Map<string, Position>;

	public spectatorCache;
	public playerSpectatorCache;
	public root;

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

		// const QTreeLeafNode* leaf = QTreeNode::getLeafStatic<const QTreeLeafNode*, const QTreeNode*>(&root, x, y);
		// if (!leaf) {
		// 	return nullptr;
		// }

		// const Floor* floor = leaf->getFloor(z);
		// if (!floor) {
		// 	return nullptr;
		// }
		// return floor ->tiles[x & FLOOR_MASK][y & FLOOR_MASK];
		return null;
	}

	public setTile(tile: Tile): void {
		const tilePos: Position = tile.getPosition();
		if (tilePos.z >= MAP_MAX_LAYERS) {
			console.log(`ERROR: Attempt to set tile on invalid coordinate ${tilePos.toString()}!`);
			return;
		}

		// QTreeLeafNode::newLeaf = false;
		// QTreeLeafNode * leaf = root.createLeaf(x, y, 15);

		// if (QTreeLeafNode::newLeaf) {
		// 	//update north
		// 	QTreeLeafNode * northLeaf = root.getLeaf(x, y - FLOOR_SIZE);
		// 	if (northLeaf) {
		// 		northLeaf ->leafS = leaf;
		// 	}

		// 	//update west leaf
		// 	QTreeLeafNode * westLeaf = root.getLeaf(x - FLOOR_SIZE, y);
		// 	if (westLeaf) {
		// 		westLeaf ->leafE = leaf;
		// 	}

		// 	//update south
		// 	QTreeLeafNode * southLeaf = root.getLeaf(x, y + FLOOR_SIZE);
		// 	if (southLeaf) {
		// 		leaf ->leafS = southLeaf;
		// 	}

		// 	//update east
		// 	QTreeLeafNode * eastLeaf = root.getLeaf(x + FLOOR_SIZE, y);
		// 	if (eastLeaf) {
		// 		leaf ->leafE = eastLeaf;
		// 	}
		// }

		// Floor * floor = leaf ->createFloor(z);
		// uint32_t offsetX = x & FLOOR_MASK;
		// uint32_t offsetY = y & FLOOR_MASK;

		// Tile *& tile = floor ->tiles[offsetX][offsetY];
		// if (tile) {
		// 	TileItemVector * items = newTile ->getItemList();
		// 	if (items) {
		// 		for (auto it = items ->rbegin(), end = items ->rend(); it != end; ++it) {
		// 			tile ->addThing(*it);
		// 		}
		// 		items ->clear();
		// 	}

		// 	Item * ground = newTile ->getGround();
		// 	if (ground) {
		// 		tile ->addThing(ground);
		// 		newTile ->setGround(nullptr);
		// 	}
		// 	delete newTile;
		// } else {
		// 	tile = newTile;
		// }
	}

	public placeCreature(centerPos: Position, creature: Creature, extendedPos: boolean = false, forceLogin: boolean = false): boolean {
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

	// public addTown(town: Town): void {
	// 	this.towns.add(town);
	// }

}
