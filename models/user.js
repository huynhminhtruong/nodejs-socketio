var mongoose = require('mongoose');
var crypto = require('crypto');
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
});
var passwordSalt = function(length){
	return crypto.randomBytes(Math.ceil(length)).toString('base64').slice(0, length);
}

var sha512 = function(password, salt){
	return crypto.createHmac('sha512', salt).update(password).digest('base64');
}

UserSchema.methods.generatePassword = function(password){
	var salt = passwordSalt(password.length);
	this.passwordSalt = salt;
	this.passwordHash = sha512(password, salt);
}

UserSchema.methods.validPassword = function(password){
	return this.passwordHash == sha512(password, this.passwordSalt);
}

module.exports = mongoose.model('User', UserSchema);