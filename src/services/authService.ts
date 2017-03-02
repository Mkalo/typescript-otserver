import { g_config } from '../otserv';
import * as models from '../models';
import * as moment from 'moment';

export class AuthService {

	public static getCharactersList(accountName: string, password: string, authToken: string, done: Function) {
		const worlds = g_config.worlds;

		const wrontCredintialsMessage = "Account name or password is not correct.";

		models.Account.findOne({
			login: accountName
		}).then((account) => {
			if (!account) {
				return done(wrontCredintialsMessage);
			}

			account.comparePassword(password, (err, validated) => {
				if (err || !validated) return done(wrontCredintialsMessage);

				const characters = [
					{
						name: "Noob",
						worldId: 0
					},
					{
						name: "Odsadaa",
						worldId: 0
					},
					{
						name: "Fdfsdgd Fdd",
						worldId: 0
					},
					{
						name: "Lul",
						worldId: 0
					},
					{
						name: "Noob",
						worldId: 0
					}
				];

				const secondsLeft = moment(account.premiumEnd).diff(moment(), 'seconds', true);
				const premium = {
					isPremium: secondsLeft <= 0 ? 0 : 1,
					timeStamp: (new Date().getTime() / 1000) + secondsLeft
				};

				return done(null, {
					worlds,
					characters,
					premium
				});
			});
		}).catch((err) => {
			console.error(err);
			return done("Somethign went wrong xD");
		});
	}

}
