var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('Image', new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	name: {
		type: String,
		trim: true
	},
	image: {
		type: String,
		trim: true
	}
}));