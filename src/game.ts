import { GameState } from './enums';

export class Game {
	public getState(): number {
		return GameState.Normal;
	}
}
