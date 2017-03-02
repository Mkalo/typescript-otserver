import { g_config } from '../otserv';

export class AuthService {
	
	public static getCharactersList(accountName: string, password: string, authToken: string, done: Function) {
		const worlds = g_config.worlds;

		// pull characters from DB when authorizing
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

		const premium = {
			days: 0,
			timeStamp: 0
		};

		return done(null, {
			worlds,
			characters,
			premium
		});
	}

}
