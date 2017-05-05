import { GameState } from './enums';
import { Player } from './Player';

export class Game {

	public minClientVersion: number = 10;
	public maxClientVersion: number = 100000;
	public clientVersionString: number = 10;

	public players: Player[] = [];

	private getPlayerFromCache(playerName: string): Player {
		for (let player of this.players) {
			if (player.name === playerName)
				return player;
		}
		return null;
	}

	public getPlayerByName(playerName: string, done: (err: Error, player?: Player) => void): void {
		const playerFromCache = this.getPlayerFromCache(playerName);
		if (playerFromCache)
			return done(null, playerFromCache);

		Player.loadPlayerFromDatabase(playerName, (err, playerFromDatabase) => {
			if (err) return done(err);

			if (playerFromDatabase)
				this.players.push(playerFromDatabase);

			return done(null, playerFromDatabase);
		});
	}

	public getState(): number {
		return GameState.Normal;
	}

}
