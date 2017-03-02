import { g_config } from '../otserv';
import * as models from '../models';
import * as moment from 'moment';

export class AuthService {

	public static getCharactersList(accountName: string, password: string, authToken: string, done: Function) {
		AuthService.getAccountInfo(accountName, password, authToken, (err, accountInfo) => {
			if (err) return done(err);

			const worlds = g_config.worlds;

			models.Player
				.find({
					account: accountInfo._id
				})
				.select('name worldId -_id')
				.exec((err, characters) => {
					if (err) return done("Couldn't get characters list.");

					const secondsLeft = moment(accountInfo.premiumEnd).diff(moment(), 'seconds', true);
					const premium = {
						isPremium: secondsLeft ? 1 : 0,
						timeStamp: (new Date().getTime() / 1000) + secondsLeft
					};

					return done(null, {
						worlds,
						characters,
						premium
					});
				});
		});
	}

	public static getAccountInfo(accountName: string, password: string, authToken: string, done: Function) {
		const wrontCredintialsMessage = "Account name or password is not correct.";

		models.Account
			.findOne({
				login: accountName
			})
			.exec((err, account) => {
				if (err || !account) return done(wrontCredintialsMessage);

				account.comparePassword(password, (err, validated) => {
					if (err || !validated) return done(wrontCredintialsMessage);

					return done(null, account);
				});
			});
	}

}
