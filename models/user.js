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
		type: Schema.Types.ObjectId,
		ref: 'Image'
	},
	role: {
		type: Number,
		'default': 0
	}
}));