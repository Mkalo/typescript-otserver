import { Item } from './Item';
import { DepotLocker } from './Depot';

export class Container extends Item {
	public getDepotLocker(): DepotLocker {
		return null;
	}
}
