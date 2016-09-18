const express = require('express'), 
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
	cookieParser = require('cookie-parser')

module.exports = function(app, io){
	mongoose.connect('mongodb://localhost/socketio')

	app.use(cookieParser())
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({extended: false}))

	app.use(methodOverride('X-HTTP-Method-Override'))
	app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}))

	app.use(passport.initialize())
	app.use(passport.session())
	app.use(flash())

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
