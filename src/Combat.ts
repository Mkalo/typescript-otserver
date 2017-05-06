import { CombatType, ConditionType } from './enums';

export class Combat {
	public static damageToConditionType(combatType: CombatType): ConditionType {
		switch (combatType) {
			case CombatType.COMBAT_FIREDAMAGE:
				return ConditionType.CONDITION_FIRE;

			case CombatType.COMBAT_ENERGYDAMAGE:
				return ConditionType.CONDITION_ENERGY;

			case CombatType.COMBAT_DROWNDAMAGE:
				return ConditionType.CONDITION_DROWN;

			case CombatType.COMBAT_EARTHDAMAGE:
				return ConditionType.CONDITION_POISON;

			case CombatType.COMBAT_ICEDAMAGE:
				return ConditionType.CONDITION_FREEZING;

			case CombatType.COMBAT_HOLYDAMAGE:
				return ConditionType.CONDITION_DAZZLED;

			case CombatType.COMBAT_DEATHDAMAGE:
				return ConditionType.CONDITION_CURSED;

			case CombatType.COMBAT_PHYSICALDAMAGE:
				return ConditionType.CONDITION_BLEEDING;

			default:
				return ConditionType.CONDITION_NONE;
		}
	}
}
