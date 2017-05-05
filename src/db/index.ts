import * as mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

class ObjectId implements mongoose.Types.ObjectId { }

import Account from './account';
import Player from './player';

const models = {
	Account,
	Player
};

export {
	mongoose,
	ObjectId,
	models
};
