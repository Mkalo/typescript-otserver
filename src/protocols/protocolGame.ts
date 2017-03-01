import { XTEA } from "../xtea";
import { NetworkMessage, OutputMessage } from "../networkmessage";
import { g_rsa, g_config, g_game} from '../otserv';
import { GameState } from '../enums';
import { Protocol } from './protocol';

const CLIENT_VERSION_STR = "10"; // for now
const CLIENT_VERSION_MIN = 1;
const CLIENT_VERSION_MAX = 10000;

const AUTHENTICATOR_DIGITS = 6;
const AUTHENTICATOR_PERIOD = 30;

export class ProtocolGame extends Protocol {

	static readonly useChecksum: boolean = true;
	static readonly serverSendsFirst: boolean = true;
	static readonly protocolIdentifier: number = 0x00;
	static readonly protocolName: string = "login game";

	public onConnect() {
		return;
	}

	public onRecvFirstMessage(msg: NetworkMessage): void {
		
	}

}
