import * as mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
	account: { type: String, ref: 'Account' },
	name: {
		type: String,
		unique: true,
		required: true
	},
	worldId: {
		type: Number,
		default: 0
	},
	group: {
		type: Number, // ????
		default: 0
	},
	experience: {
		type: Number,
		default: 0
	},
	health: {
		type: Number,
		default: 0
	},
	maxHealth: {
		type: Number,
		deault: 0
	},
	mana: {
		type: Number,
		default: 0
	},
	maxMana: {
		type: Number,
		default: 0
	},
	manaSpent: {
		type: Number,
		default: 0
	},
	soul: {
		type: Number,
		default: 0
	},
	townID: {
		type: Number,
		default: 0
	},
	vocation: {
		type: String,
		enum: ["none", "sorcerer", "knight", "palladin", "druid"],
		default: "none"
	},
	outfit: {
		body: {
			type: Number,
			default: 0
		},
		feet: {
			type: Number,
			default: 0
		},
		head: {
			type: Number,
			default: 0
		},
		legs: {
			type: Number,
			default: 0
		},
		type: {
			type: Number,
			default: 0
		},
		addons: {
			type: Number,
			enum: [0, 1, 2, 3],
			default: 0
		}
	},
	position: {
		x: {
			type: Number,
			default: 0
		},
		y: {
			type: Number,
			default: 0
		},
		z: {
			type: Number,
			default: 0
		}
	},
	conditions: {
		type: Number,
		default: 0
	},
	sex: {
		type: String,
		enum: ["male", "female"],
		default: "male"
	},
	skull: {
		type: Number,
		default: 0
	},
	skullEnd: {
		type: Date,
		default: new Date(0)
	},
	onlineTime: {
		type: Number,
		default: 0
	},
	lastLogin: {
		type: Date,
		default: new Date(0)
	},
	deleted: {
		type: Boolean,
		defaut: false
	},
	balance: {
		type: Number,
		default: 0
	},
	stamina: {
		type: Number,
		default: 42 * 60 * 60
	},
	offlineTrainingTime: {
		type: Number,
		default: 12 * 60 * 60
	},
	offlineTrainingSkill: {
		type: String,
		enum: ["none", "club", "sword", "axe", "distance", "magic"],
		default: "none"
	},
	skillsTries: {
		fist: {
			type: Number,
			default: 0
		},
		club: {
			type: Number,
			default: 0
		},
		sword: {
			type: Number,
			default: 0
		},
		axe: {
			type: Number,
			default: 0
		},
		distance: {
			type: Number,
			default: 0
		},
		shielding: {
			type: Number,
			default: 0
		},
		fishing: {
			type: Number,
			default: 0
		}
	}
});

export default mongoose.model('Player', PlayerSchema);
