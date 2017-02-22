import { RSA } from './rsa';

export class Otserv {
  static start() {

    let g_rsa: RSA = RSA.getInstance();
    let text: string = 'Hello RSA!';
    let encrypted: string = g_rsa.getRSA().encrypt(text, 'base64');
    console.log('encrypted: ', encrypted);
    let decrypted: string = g_rsa.getRSA().decrypt(encrypted, 'utf8');
    console.log('decrypted: ', decrypted);

    console.log("Server started!");
  }
}
