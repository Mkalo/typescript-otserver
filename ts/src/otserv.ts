import { RSA } from './rsa';
import { XTEA } from "./xtea";
import { NetworkMessage } from "./networkmessage";

export class Otserv {
  static start() {

    /*let g_rsa: RSA = RSA.getInstance();
    let text: string = 'Hello RSA!';
    let encrypted: string = g_rsa.getRSA().encrypt(text, 'base64');
    console.log('encrypted: ', encrypted);
    let decrypted: string = g_rsa.getRSA().decrypt(encrypted, 'utf8');
    console.log('decrypted: ', decrypted);

    let msg: NetworkMessage = new NetworkMessage();
    let xtea: XTEA = new XTEA(new Uint32Array([121324, 105464, 50055, 312015]));
    msg.addString("Mkalo is awesome.");
    console.log("Original: ");
    console.log(msg.getLength());
    for(var i = 0; i < msg.getLength(); i++) {
      console.log(i + ": " + msg.getOutputBuffer()[i]);
    }
    console.log("Encrypted: ");
    xtea.encrypt(msg);
    console.log(msg.getLength());
    for(var i = 0; i < msg.getLength(); i++) {
      console.log(i + ": " + msg.getOutputBuffer()[i]);
    }*/

    console.log("Server started!");
  }
}
