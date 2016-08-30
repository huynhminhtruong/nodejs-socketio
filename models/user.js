var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('User', new Schema({
	name: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true
	},
	passwordSalt: String,
	passwordHash: String,
	skills: [
		{
			type: String,
			trim: true
		}
	],
	avatar: {
		type: String,
		trim: true
	},
	role: {
		type: Number,
		'default': 0
	}
}));