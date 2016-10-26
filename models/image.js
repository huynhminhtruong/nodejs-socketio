var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('Image', new Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	name: {
		type: String,
		trim: true
	},
	description: {
		type: String
	}, 
	vote: {
		type: Number
		'default': 0
	}, 
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			}, 
			comments: [
				description: {
					type: String,
					trim: true
				}
			]
		}
	], 
	image: {
		type: String,
		trim: true
	}
}));