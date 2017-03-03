import * as deepExtend from 'deep-extend';
import { Position } from './position';
import { Sex, Vocation, Skill } from '../enums';
import { Outfit } from './outfit';
import { SkillTries } from './skillTries';

export class Player {
	public name: string = '';
	public worldId: number = 0;
	public group: number = 0;
	public experience: number = 0;
	public health: number = 0;
	public mana: number = 0;
	public manaSpent: number = 0;
	public soul: number = 0;
	public townID: number = 0;
	public vocation: Vocation = Vocation.None;
	public outfit: Outfit = new Outfit;
	public position: Position = new Position;

	public conditions: number = 0;
	public sex: Sex = Sex.Male;
	public skull: number = 0;
	public skullEnd: Date = new Date;
	public onlineTime: number = 0;
	public deleted: boolean = false;
	public balance: number = 0;
	public stamina: number = 42 * 60 * 60;
	public offlineTrainingTime: number = 12 * 60 * 60;
	public offlineTrainingSkill: Skill = Skill.None;
	public skillsTries: SkillTries = new SkillTries;

	public static fromDBObject(obj: any): Player {
		const player = new Player();

		for (let key in obj) {
			if (obj.hasOwnProperty(key) && player.hasOwnProperty(key) && typeof key !== 'function') {
				player[key] = obj[key];
			}
		}

		return player;
	}
}
