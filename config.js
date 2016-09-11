const express = require('express'), 
	mongoose = require('mongoose'), 
	bodyParser = require('body-parser'), 
	multer = require('multer'), 
	uploads = multer({dest: 'public/uploads'}), 
	path = require('path')

module.exports = function(app, io){
	mongoose.connect('mongodb://localhost/socketio')
	
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({extended: false}))

	app.set('view engine', 'ejs')
	app.engine('ejs', require('ejs').renderFile)
	app.set('views', __dirname + '/views')

	app.use(express.static(path.join(__dirname, '/public')))
}
