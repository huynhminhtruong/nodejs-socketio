var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('Image', new Schema({
	name: {
		type: String,
		trim: true
	},
	image: {
		type: String,
		trim: true
	}
}));