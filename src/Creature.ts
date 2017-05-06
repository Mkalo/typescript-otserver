import { Position } from './Position';
import { Outfit } from './Outfit';
import { Thing } from './Thing';
import { Player } from './Player';
import { Monster } from './Monster';
import { Tile } from './Tile';
import { Item, ItemType } from './Item';
import { CombatType, ConditionType } from './enums';

export class Creature extends Thing {
	protected id: number = 0;
	public name: string = '';
	public position: Position = new Position(0, 0, 0);
	public outfit: Outfit = new Outfit("default", 0, 0);

	public isPlayer: boolean = false;

	public health: number = 0;
	public maxHealth: number = 0;

	public static speedA: number = 857.36;
	public static speedB: number = 261.29;
	public static speedC: number = -4795.01;

	private removed: boolean = false;

	public setID(newId: number): void {
		this.id = newId;
	}

	public getID(): number {
		return this.id;
	}

	public isRemoved(): boolean {
		return this.removed;
	}

	public remove(): void {
		this.removed = true;
	}

	public canSeeCreature(creature: Creature): boolean {
		return false;
	}

	public getPlayer(): Player {
		return null;
	}

	public getMonster(): Monster {
		return null;
	}

	public canPushCreatures(): boolean {
		return false;
	}

	public canPushItems(): boolean {
		return true;
	}

	public isInGhostMode(): boolean {
		return false;
	}

	public isImmune(combatType: CombatType): boolean {
		return true;
	}

	public hasCondition(type: ConditionType, subId: number = 0): boolean {
		return false;
	}

	public isInvisible(): boolean {
		return true;
	}

	public onRemoveTileItem(tile: Tile, pos: Position, iType: ItemType, item: Item): void {

	}

	public onUpdateTileItem(tile: Tile, pos: Position, oldItem: Item, oldType: ItemType, newItem: Item, newType: ItemType): void {

	}

	public onAddTileItem(tile: Tile, pos: Position): void {

	}
}
