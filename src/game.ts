import { GameState } from './enums';

export class Game {

	public minClientVersion: number = 10;
	public maxClientVersion: number = 100000;
	public clientVersionString: number = 10;


	public getState(): number {
		return GameState.Normal;
	}

}
