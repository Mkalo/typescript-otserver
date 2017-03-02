import * as mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
	account : { type: String, ref: 'Account' },
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
	vocation: {
		type: String,
		enum: ["none", "sorcerer", "knight", "palladin", "druid"],
		default: "none"
	}
});

export const Player = mongoose.model('Player', PlayerSchema);
