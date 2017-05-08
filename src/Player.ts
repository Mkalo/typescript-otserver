import { Creature } from './Creature';
import { Vocation } from './Vocation';
import { Position } from './Position';
import { Thing } from './Thing';
import { Cylinder } from './Cylinder';
import { CylinderLink } from './enums';
import { Tile } from './Tile';
import { Item } from './Item';
import { models, ObjectId } from './db';

import { g_map } from './otserv';

export class Player extends Creature {
	public static playerAutoID: number = 0x10000000;

	id: number = 0; // temp
	public dbID: ObjectId;

	public vocation: Vocation = new Vocation();
	public townId: number = 0;
	public stamina: number = 0;

	public onlineTime: number = 0;
	public lastLogin: Date = new Date(0);

	public experience: number = 0;
	public balance: number = 0;

	public mana: number = 0;
	public maxMana: number = 0;
	public manaSpent: number = 0;
	public soul: number = 0;

	public isLoggedIn: boolean = false;

	public lastPong: Date = new Date(0);

	public isPlayer: boolean = true;

	public static loadPlayerFromDatabase(playerName: string, done: (err: Error, player?: Player) => void): void {
		models
			.Player
			.findOne({
				name: playerName
			})
			.exec((err, result) => {
				if (err) return done(err);

				const playerObj = Player.createPlayerObjectFromDatabaseObject(result);
				return done(null, playerObj);
			});
	}

	private static createPlayerObjectFromDatabaseObject(databaseObject: any): Player {
		const player = new Player();

		player.dbID = databaseObject._id;

		player.name = databaseObject.name;
		player.balance = databaseObject.balance;
		player.experience = databaseObject.experience;

		player.health = databaseObject.health;
		player.maxHealth = databaseObject.maxHealth;

		player.mana = databaseObject.mana;
		player.maxMana = databaseObject.maxMana;
		player.manaSpent = databaseObject.manaSpent;

		player.onlineTime = databaseObject.onlineTime;
		// player.outfit = new Outfit;
		player.position = new Position(databaseObject.position.x, databaseObject.position.y, databaseObject.position.z)
		player.soul = databaseObject.soul;
		player.stamina = databaseObject.stamina;
		player.townId = databaseObject.townId;
		player.vocation = new Vocation(); ////

		return player;
	}

	public setID(): void {
		if (this.id === 0) {
			this.id = Player.playerAutoID++;
		}
	}

	public isAccessPlayer(): boolean {
		return false;
	}

	public isInGhostMode(): boolean {
		return false;
	}

	public canWalkthrough(creature: Creature): boolean {
		return false;
	}

	public isPzLocked(): boolean {
		return false;
	}

	public postAddNotification(thing: Thing, oldParent: Cylinder, index: number, link: CylinderLink = CylinderLink.LINK_OWNER): void {

	}

	public postRemoveNotification(thing: Thing, newParent: Cylinder, index: number, link: CylinderLink = CylinderLink.LINK_OWNER): void {

	}

	public sendUpdateTile(tile: Tile, pos: Position): void {

	}

	public sendRemoveTileThing(pos: Position, stackpos: number): void {

	}

	public sendUpdateTileItem(tile: Tile, pos: Position, item: Item): void {

	}

	public sendAddTileItem(tile: Tile, pos: Position, item: Item): void {

	}

	public getTile(): Tile {
		const playerPos = this.getPosition();
		const tile = g_map.getTile(playerPos);
		return tile;
	}
}
