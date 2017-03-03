import { GameState } from './enums';
import { PlayerService } from './services';
import * as deepExtend from 'deep-extend';

class Player {
	public name: String;

	constructor(obj: any) {
		deepExtend(this, obj);
	}
}

export class Game {

	public minClientVersion: number = 10;
	public maxClientVersion: number = 100000;
	public clientVersionString: number = 10;

	private players: Player[];

	constructor() {
		this.players = [];
	}

	public getState(): number {
		return GameState.Normal;
	}

	public getPlayer(name: String, done: Function): void {
		const players = this.players;
		const playersLength = players.length;
		
		for (let i = 0; i < playersLength; i++) {
			const player = players[i];
			if (player.name === name)
				return done(null, player);
		}

		PlayerService.getPlayerData(name, (err, playerData) => {
			if (err) return done(err);

			const player = new Player(playerData);
			this.players.push(player);
			return done(null, player);
		});
	}

}
