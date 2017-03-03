export class Position {

	private x: number;
	private y: number;
	private z: number;

	constructor(a? :any);
	constructor(position: Position);
	constructor(x: number, y: number, z: number);
	constructor(p1?: any, p2?: any, p3?: any) {
		if (typeof p1 === "undefined")
			return this.constructor2(0, 0, 0);
		if (p1 instanceof Position)
			return this.constructor1(p1);

		if (typeof p1 === "number" && typeof p2 === "number" && typeof p3 === "number")
			return this.constructor2(p1, p2, p3);
	}

	private constructor1(position: Position): Position {
		this.x = position.x;
		this.y = position.y;
		this.z = position.z;
		return this;
	}

	private constructor2(x: number, y: number, z: number): Position {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

}
