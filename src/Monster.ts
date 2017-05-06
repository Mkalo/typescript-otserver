import { Creature } from './Creature';

export class Monster extends Creature {
	public isSummon(): boolean {
		return false;
	}

	public getMaster(): Creature {
		return null;
	}
}
