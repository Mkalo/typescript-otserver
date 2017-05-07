import { Thing } from './Thing';
import * as aaa from './Thing';
import { Item } from './Item';
import { Creature } from './Creature';
import { CylinderFlag, CylinderLink, ReturnValue } from './enums';

const INDEX_WHEREEVER = -1;
const Thing1 = require('./Thing');

console.log({ aaa, Thing, Thing1 });

export class Cylinder extends Thing {

	/**
		  * Query if the cylinder can add an object
		  * \param index points to the destination index (inventory slot/container position)
			* -1 is a internal value and means add to a empty position, with no destItem
		  * \param thing the object to move/add
		  * \param count is the amount that we want to move/add
		  * \param flags if FLAG_CHILDISOWNER if set the query is from a child-cylinder (check cap etc.)
			* if FLAG_NOLIMIT is set blocking items/container limits is ignored
		  * \param actor the creature trying to add the thing
		  * \returns ReturnValue holds the return value
		  */
	public queryAdd(index: number, thing: Thing, count: number, flags: number, actor: Creature = null): ReturnValue {
		return null;
	}

	/**
		  * Query the cylinder how much it can accept
		  * \param index points to the destination index (inventory slot/container position)
			* -1 is a internal value and means add to a empty position, with no destItem
		  * \param thing the object to move/add
		  * \param count is the amount that we want to move/add
		  * \param maxQueryCount is the max amount that the cylinder can accept
		  * \param flags optional flags to modify the default behaviour
		  * \returns ReturnValue holds the return value
		  */
	public queryMaxCount(index: number, thing: Thing, count: number, maxQueryCount: { value: number }, flags: number): ReturnValue {
		return null;
	}

	/**
		  * Query if the cylinder can remove an object
		  * \param thing the object to move/remove
		  * \param count is the amount that we want to remove
		  * \param flags optional flags to modify the default behaviour
		  * \returns ReturnValue holds the return value
		  */
	public queryRemove(thing: Thing, count: number, flags: number): ReturnValue {
		return null;
	}

	/**
		  * Query the destination cylinder
		  * \param index points to the destination index (inventory slot/container position),
			* -1 is a internal value and means add to a empty position, with no destItem
			* this method can change the index to point to the new cylinder index
		  * \param destItem is the destination object
		  * \param flags optional flags to modify the default behaviour
			* this method can modify the flags
		  * \returns Cylinder returns the destination cylinder
		  */
	public queryDestination(index: { value: number }, thing: Thing, destItem: Item, flags: { value: number }): Cylinder {
		return null;
	}

	/**
		  * Add the object to the cylinder
		  * \param thing is the object to add
		  * \param index points to the destination index (inventory slot/container position)
		  */
	public addThing(thing: Thing, index: number): void {
		return null;
	}

	/**
		  * Update the item count or type for an object
		  * \param thing is the object to update
		  * \param itemId is the new item id
		  * \param count is the new count value
		  */
	public updateThing(thing: Thing, itemId: number, count: number): void {
		return null;
	}

	/**
		  * Replace an object with a new
		  * \param index is the position to change (inventory slot/container position)
		  * \param thing is the object to update
		  */
	public replaceThing(index: number, thing: Thing): void {
		return null;
	}

	/**
		  * Remove an object
		  * \param thing is the object to delete
		  * \param count is the new count value
		  */
	public removeThing(thing: Thing, count: number): void {
		return null;
	}

	/**
		  * Is sent after an operation (move/add) to update internal values
		  * \param thing is the object that has been added
		  * \param index is the objects new index value
		  * \param link holds the relation the object has to the cylinder
		  */
	public postAddNotification(thing: Thing, oldParent: Cylinder, index: number, link: CylinderLink = CylinderLink.LINK_OWNER): void {
		return null;
	}

	/**
		  * Is sent after an operation (move/remove) to update internal values
		  * \param thing is the object that has been removed
		  * \param index is the previous index of the removed object
		  * \param link holds the relation the object has to the cylinder
		  */
	public postRemoveNotification(thing: Thing, newParent: Cylinder, index: number, link: CylinderLink = CylinderLink.LINK_OWNER): void {
		return null;
	}

	/**
		  * Gets the index of an object
		  * \param thing the object to get the index value from
		  * \returns the index of the object, returns -1 if not found
		  */
	public getThingIndex(thing: Thing): number {
		return -1;
	}

	/**
	  * Returns the first index
	  * \returns the first index, if not implemented 0 is returned
	  */
	public getFirstIndex(): number {
		return 0;
	}

	/**
	  * Returns the last index
	  * \returns the last index, if not implemented 0 is returned
	  */
	public getLastIndex(): number {
		return 0;
	}

	/**
	  * Gets the object based on index
	  * \returns the object, returns nullptr if not found
	  */
	public getThing(index: number): Thing {
		return null;
	}

	/**
	  * Get the amount of items of a certain type
	  * \param itemId is the item type to the get the count of
	  * \param subType is the extra type an item can have such as charges/fluidtype, -1 means not used
	  * \returns the amount of items of the asked item type
	  */
	public getItemTypeCount(itemId: number, subType: number = -1): number {
		return 0;
	}

	/**
	  * Get the amount of items of a all types
	  * \param countMap a map to put the itemID:count mapping in
	  * \returns a map mapping item id to count (same as first argument)
	  */
	public getAllItemTypeCount(countMap: Map<number, number>): Map<number, number> {
		return countMap;
	}

	/**
	  * Adds an object to the cylinder without sending to the client(s)
	  * \param thing is the object to add
	  * \param index points to the destination index (inventory slot/container position)
	  */
	public internalAddThing(thing: Thing, index?: number): void {
		return null;
	}

	public startDecaying(): void {
		return null;
	}
}

export class VirtualCylinder extends Cylinder {
	public static virtualCylinder: VirtualCylinder = new VirtualCylinder;



	public queryAdd(index: number, thing: Thing, count: number, flags: number, actor: Creature = null): ReturnValue {
		return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
	}

	public queryMaxCount(index: number, thing: Thing, count: number, maxQueryCount: { value: number }, flags: number): ReturnValue {
		return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
	}

	public queryRemove(thing: Thing, count: number, flags: number): ReturnValue {
		return ReturnValue.RETURNVALUE_NOTPOSSIBLE;
	}

	public queryDestination(index: { value: number }, thing: Thing, destItem: Item, flags: { value: number }): Cylinder {
		return null;
	}

	public addThing(thing: Thing, index: number): void {
		return null;
	}

	public updateThing(thing: Thing, itemId: number, count: number): void {
		return null;
	}

	public replaceThing(index: number, thing: Thing): void {
		return null;
	}

	public removeThing(thing: Thing, count: number): void {
		return null;
	}

	public postAddNotification(thing: Thing, oldParent: Cylinder, index: number, link: CylinderLink = CylinderLink.LINK_OWNER): void {
		return null;
	}

	public postRemoveNotification(thing: Thing, newParent: Cylinder, index: number, link: CylinderLink = CylinderLink.LINK_OWNER): void {
		return null;
	}

	public isPushable(): boolean {
		return false;
	}

	public getThrowRange(): number {
		return 1;
	}

	public getDescription(int32_t): string {
		return "";
	}

	public isRemoved(): boolean {
		return false;
	}
}
