import { CombatType } from './enums';
import { Item } from './Item';

export class MagicField extends Item {
	public isBlocking(): boolean {
		return false;
	}

	public getCombatType(): CombatType {
		return null;
	}
}
