import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as validator from 'validator';

const SALT_LENGTH = 10;

export const AccountSchema = new mongoose.Schema({
	login: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		validate: [ validator.isEmail, 'Invalid email address.' ]
	},
	type: {
		type: String,
		enum: ['player', 'tutor', 'gamemaster'],
		default: 'player'
	},
	secret: {
		type: String,
		default: ''
	},
	premiumEnd: {
		type: Date,
		default: new Date(0)
	},
	tibiaCoinsBalance: {
		type: Number,
		default: 0
	},
	creationDate: {
		type: Date,
		default: Date.now
	}
});

AccountSchema.pre('save', function(next) {
	const user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_LENGTH, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			return next();
		});
	});
});

AccountSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		
		return cb(null, isMatch);
	});
};

export const Account = mongoose.model('Account', AccountSchema);
