const express = require('express'), 
	expressJWT = require('express-jwt'), 
	jwt = require('jsonwebtoken'), 
	mongoose = require('mongoose'), 
	exphbs = require('express-handlebars'), 
	session = require('express-session'), 
	logger = require('morgan'), 
	methodOverride = require('method-override'), 
	passport = require('passport'), 
	flash = require('connect-flash'), 
	bodyParser = require('body-parser'), 
	multer = require('multer'), 
	uploads = multer({dest: 'public/uploads'}), 
	path = require('path'), 
	cookieParser = require('cookie-parser'), 
	authen = require('./authenticate'), 
	request = require('request')

module.exports = function(app, io){
	mongoose.connect('mongodb://localhost/socketio')

	app.set('supersecret', authen.secret)

	app.use(cookieParser())
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({extended: true}))
	app.use(expressJWT({secret: authen.secret}).unless({ path: ['/', '/login']}))

	app.use('/*', function(req, res, next) {
	    res.setHeader('Access-Control-Allow-Origin', '*')
	    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
	    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
	    next()
	})

	app.set('trust proxy', 1)

	app.use(session({
	  secret: authen.secret
	}))

	app.engine('.hbs', exphbs({
		defaultLayout: 'main', 
		extname: '.hbs', 
		layoutsDir: path.join(__dirname, 'views/layouts'), 
		partialsDir: path.join(__dirname, 'views/partials')
	}))

	app.set('view engine', '.hbs')
	app.set('views', __dirname + '/views')

	app.use(express.static(path.join(__dirname, '/public')))
}
