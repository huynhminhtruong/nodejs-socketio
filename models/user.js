var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true
	},
	password: {
		type: String,
		trim: true
	},
	skills: [
		{
			type: String,
			trim: true
		}
	],
	avatar: {
		type: String,
		trim: true
	}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;