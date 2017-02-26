import * as os from 'os';

export const printInfo = () => {
	console.log(`--- Informations:
| Engine: Typescripten
| Engine version: 1.0.0-alpha
| NodeJS version: ${process.version}
| Operating system: ${os.platform()}
`)
};

export class LoadingText {

	private static P = ["   ", ".  ", ".. ", "..."];
	private static frameTick: number = 100;
	private interval: NodeJS.Timer;
	private text: string;
	private start: number;
	private x: number;

	constructor(text: string) {
		this.text = text;
		this.start = new Date().getTime();
		this.x = 3;
		this.interval = setInterval(() => this.onTick(), LoadingText.frameTick);
		this.onTick();
	}

	private onTick(): void {
		process.stdout.write("\r" + this.text + LoadingText.P[this.x++]);
		this.x &= 3;
	}

	public stop(): void {
		console.log("\n" + this.text + " took " + (new Date().getTime() - this.start) + "ms.");
		clearInterval(this.interval);
	}
	
}