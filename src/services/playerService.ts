import { g_config } from '../otserv';
import * as models from '../models';
import * as moment from 'moment';
import { Player } from '../objects';

export class PlayerService {

	public static getPlayerData(playerName: String, done: (err: string, player?: Player) => void) {
		models.Player
				.findOne({
					name: playerName
				})
				.exec((err, playerData) => {
					if (err) return done("Couldn't find character.");

					const player: Player = Player.fromDBObject(playerData);

					return done(null, player);
				});
	}

}
