import { GameState } from './enums';
import { Player } from './Player';
import { Creature } from './Creature';
import { Item } from './Item';

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

	public releaseItem(item: Item): void {

	}

	public releaseCreature(creature: Creature): void {

	}

	public addUniqueItem(uniqueId: number, item: Item): boolean {
		// TO DO
		return true;
		// auto result = uniqueItems.emplace(uniqueId, item);
		// if (!result.second) {
		// 	std::cout << "Duplicate unique id: " << uniqueId << std::endl;
		// }
		// return result.second;
	}

	public startDecay(item: Item): void {
		// if (!item || !item.canDecay()) {
		// 	return;
		// }

		// const decayState = item.getDecaying();
		// if (decayState === DECAYING_TRUE) {
		// 	return;
		// }

		// if (item.getDuration() > 0) {
		// 	item.incrementReferenceCounter();
		// 	item.setDecaying(DECAYING_TRUE);
		// 	toDecayItems.push_front(item);
		// } else {
		// 	internalDecayItem(item);
		// }
	}

}
