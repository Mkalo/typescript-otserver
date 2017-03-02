import * as ip from 'ip';

export class IPService {
	public static isBanned(ipString: string, done: Function) {
		const ipNumber = ip.toLong(ipString);

		// check ip in db or something

		return done(null);
	}
}
