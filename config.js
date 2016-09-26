var express = require('express'), 
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
	request = require('request'), 
	config = require('./config/development')

module.exports = function(app, io){
	mongoose.connect(config.database)

	app.set('supersecret', config.secret)

	app.use(cookieParser())
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({extended: false}))
	app.use(session({ secret: authen.secret }))

	app.use(expressJWT({ 
		secret: authen.secret, 
		credentialsRequired: false, 
		getToken: function getAccessToken(req) {
			if (req.session.authorization || req.query.access_token) {
				return req.session.authorization || req.query.access_token
			}

			return null
		}
	}).unless({ path: ['/', '/login']}))

	app.use(function(req, res, next) {
	    res.header('Access-Control-Allow-Origin', '*')
	    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
	    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With')
	    if (req.session.authorization) {
	    	res.header('Authorization', 'Bearer ' + req.session.authorization)
	    }
	    next()
	})

	app.use(function(req, res, next) {
		next()
	})

	app.set('trust proxy', 1)

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
