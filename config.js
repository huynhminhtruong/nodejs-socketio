const express = require('express'), 
	expressJWT = require('express-jwt'), 
	jwt = require('jsonwebtoken'), 
	mongoose = require('mongoose'), 
	exphbs = require('express-handlebars'), 
	session = require('express-session'), 
	logger = require('morgan'), 
	methodOverride = require('method-override'), 
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
	app.use(bodyParser.urlencoded({ extended: true }))
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
		res.locals.styles = []
		res.locals.scripts = []

		res.addStyle = function(url) {
			res.locals.styles.push({
				url: url
			})
		}

		res.addScript = function(url) {
			res.locals.scripts.push({
				url: url
			})
		}

		res.addStyle('/css/main.css')
		res.addStyle('/css/sb-admin.css')
		res.addStyle('/font-awesome/css/font-awesome.min.css')
		res.addScript('/js/angular.min.js')
		res.addScript('/js/bootbox.min.js')
		res.addScript('/socket.io/socket.io.js')

		next()
	})

	app.set('trust proxy', 1)

	app.engine('.hbs', exphbs({
		defaultLayout: 'main', 
		extname: '.hbs', 
		layoutsDir: path.join(__dirname, 'views/layouts'), 
		partialsDir: path.join(__dirname, 'views/partials'), 
		aboutDir: path.join(__dirname, 'views/about'), 
		chatDir: path.join(__dirname, 'views/chat'), 
		imageDir: path.join(__dirname, 'views/image'), 
		userDir: path.join(__dirname, 'views/user')
	}))

	app.set('view engine', '.hbs')
	app.set('views', __dirname + '/views')

	app.use(express.static(path.join(__dirname, '/public')))
}
