import * as Enums from './enums';

export class ItemType {

	public serverID: number = 0;
	public clientID: number = 100;
	public weight: number = 0;
	public name: string = '';
	public description: string;
	public article: string;
	public pluralName: string;
	public specialDescription: string;
	public runeSpellName: string;
	public armor: number = 0;
	public volume: number = 0;
	public attack: number = 0;
	public defense: number = 0;
	public extraAttack: number = 0;
	public extraDefense: number = 0;
	public rotateTo: number = 0;
	public showCount: boolean = false;
	public floorChangeDirection: Enums.FloorChangeDirection = Enums.FloorChangeDirection.None;
	public corpseType: Enums.CorpseType = Enums.CorpseType.None;
	public fluid: Enums.FluidType = Enums.FluidType.Empty;
	public maxTextLength: number = 0;
	public writeOnceItemId: number = 0;
	public slotType: Enums.SlotType = Enums.SlotType.None;
	public weaponType: Enums.WeaponType = Enums.WeaponType.None;
	public projectileType: Enums.ProjectileType = Enums.ProjectileType.None;
	public ammoType: Enums.AmmoType = Enums.AmmoType.None;
	public group: number = 0;
	public effect: Enums.Effect = Enums.Effect.None;
	public range: number = 0;
	public stopDuration: number = 0;
	public decayTo: number = 0;
	public transformEquipTo: number = 0;
	public transformDequipTo: number = 0;
	public duration: number = 0;
	public showDuration: boolean = false;
	public charges: number = 0;
	public showCharges: boolean = false;
	public breakChance: number = 0;
	public speed: number = 0;
	public isAlwaysOnTop: boolean = false;
	public topOrder: number = 0;
	public isBlocking: boolean = false;
	public isProjectileBlocking: boolean = false;
	public isPathBlocking: boolean = false;
	public hasHeight: boolean = false;
	public isUseable: boolean = false;
	public isPickupable: boolean = false;
	public isMoveable: boolean = false;
	public isStackable: boolean = false;
	public isVertical: boolean = false;
	public isHorizontal: boolean = false;
	public isHangable: boolean = false;
	public isDistanceReadable: boolean = false;
	public isRotatable: boolean = false;
	public isReadable: boolean = false;
	public isWriteable: boolean = false;
	public hasClientCharges: boolean = false;
	public canLookThrough: boolean = false;
	public hasExtraByte: boolean = false;

	public extend(xmlItem: XMLItem): void {
		const obj = xmlItem.getObject();
		if (obj.name)
			this.name = obj.name;

		// TO DO: extend main object with all xml properties
	}
}

export class ItemFlags {

	private value: number = 0;

	constructor(value: number) {
		this.value = value;
	}

	public hasFlag(flag): boolean {
		return (this.value & flag) !== 0;
	}

}

export class XMLItem {

	private itemObj: any;
	
	constructor(item: any) {
		this.itemObj = item || {};
	}

	public isValid(): boolean {
		return !!this.getServerID();
	}

	public getObject(): any {
		return this.itemObj;
	}

	public getServerID(): number {
		return parseInt(this.itemObj.id) || 0;
	}
}

export class Item {

	private itemType: ItemType;

	constructor(itemType: ItemType) {
		this.itemType = itemType;
	}

	public isGround(): boolean {
		return this.itemType.group === Enums.ItemGroup.Ground;
	}

	public getName(): string {
		return this.itemType.name;
	}

	public static create(idOrName: string | number): Item {
		const itemType: ItemType = Items.getItemType(idOrName);
		return new Item(itemType);
	}

}

export class Items {

    public static idMap: Map<number, ItemType> = new Map<number, ItemType>();
    public static nameMap: Map<string, ItemType> = new Map<string, ItemType>();

    private static defaultObject: ItemType = new ItemType();

    public static addItemType(itemType: ItemType): void {
        const itemId = itemType.serverID;
        const itemName = itemType.name;

        Items.idMap.set(itemId, itemType);
        Items.nameMap.set(itemName, itemType);
    }

    public static getItemType(idOrName: string | number): ItemType {
        idOrName = Number(idOrName) || idOrName; // because "3031" and 3031 are different indexes for Map
		let lookMap: Map<string | number, ItemType>;
        if (typeof idOrName === "number") {
            lookMap = Items.idMap;
        } else {
            lookMap = Items.nameMap;
        }

        const ret: ItemType = lookMap.get(idOrName);
        if (ret !== undefined) {
            return ret;
        }

        return Items.defaultObject;
    }

}
