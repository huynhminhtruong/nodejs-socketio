var express = require('express'), 
	fs = require('fs'), 
	mongoose = require('mongoose'), 
	bodyParser = require('body-parser');

module.exports = function(app, io){
	mongoose.connect('mongodb://localhost/socketio');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));

	app.set('view engine', 'ejs');
	app.engine('ejs', require('ejs').renderFile);
	app.set('views', __dirname + '/views');

	app.use(express.static(__dirname + '/public'));
};
