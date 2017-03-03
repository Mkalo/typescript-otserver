import { g_config } from '../otserv';
import * as models from '../models';
import * as moment from 'moment';

export class PlayerService {

	public static getPlayerData(playerName: String, done: Function) {
		models.Player
				.findOne({
					name: playerName
				})
				.exec((err, player) => {
					if (err) return done("Couldn't find character.");

					return done(null, player);
				});
	}

}
