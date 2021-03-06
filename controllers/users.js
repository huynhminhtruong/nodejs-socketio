const User = require('../models/user'), 
		fs = require('fs'), 
		multer = require('multer'), 
		uploads = multer({dest: './public/uploads'}).single('file'), 
		authentication = require('../config/authentication')

function storeAccessToken(req, user, next) {
	req.session.authorization = authentication.generateToken(req, user)
	next()
}

function renderForm(res, template, actions, errors) {
	res.render(template, {
		method: '/users/new',
		title: 'Welcome New User',
		name: 'Your name', 
		email: 'Your email',
		password: 'Your password',
		errors: errors,
		register: 'register-image',
		actions: actions,
		isRegister: true
	})
}

function redirect(res, url) {
	return res.redirect(url)
}

module.exports = function(app, io){
	var newUser = io.of('/newuser').on('connection', function(socket) {
		
	})

	app.get('/', authentication.verify, (req, res) => {
		res.render('./about/about', {})
	})

	app.route('/users/logout').post(authentication.deleteToken, (req,res) => {
		res.status(200).json({ logout: true })
	})

	app.route('/login')
	.get((req,res) => {
		if (req.headers.authorization || req.session.authorization) {
			return res.status(200).json(req.user)
		}

		res.render('./login', {
			method: '/login', 
			title: 'Please sign in', 
			email: 'Your email', 
			password: 'Password', 
			actions: [{name: 'Sign in', type: 'submit'}]
		})
	}).post(uploads, (req, res) => {
		User.findOne({email: req.body.email}).exec(function(error, user){
			if (error) {
				return next(error)
			}
			if (user.validPassword(req.body.password)) {
				storeAccessToken(req, user, (access_token) => {
					res.redirect('/users/welcome')
				})
			} else {
				return res.status(500).json({ 'error': 'Incorrect password' })
			}
		})
	})

	app.get('/users/welcome', authentication.verify, authentication.isAdmin, (req, res) => {
		console.log('Login')
		res.render('./user/welcome', {
			name: req.user.name, 
			avatar: req.user.avatar
		})
	})

	app.get('/users/edit', authentication.verify, authentication.isAdmin, (req, res) => {
		res.render('./user/edit', {
			method: '/users/edit', 
			actions: [ 
				{ name: 'Cancel', class: 'btn-default' }, 
				{ name: 'Edit', class: 'btn-success' } 
			], 
			isRegister: false, 
			name: req.user.name, 
			email: req.user.email, 
			avatar: req.user.avatar
		})
	}).post(uploads, (req, res) => {

	})

	app.route('/users/new')
	.get((req, res) => {
		renderForm(res, './user/register', [{name: 'Register', class: 'btn-success'}])
	}).post(uploads, (req, res) => {
		const name = req.body.name, email = req.body.email, 
		password = req.body.password, user = new User()

		user.name = name
		user.email = email
		user.generatePassword(password)

		if (req.file && req.file.path) {
			user.avatar = 'data:image/png;base64,' + fs.readFileSync(req.file.path).toString('base64')
		}

		fs.unlink(req.file.path)

		user.save(function (error, user) {
			var errors = {}

			if (error) {
				errors.email = error.errors.email.value
				errors.message = error.errors.email.message
				
				renderForm(res, './user/register', [{name: 'Register', class: 'btn-success'}], errors)
			} else {
				newUser.emit('new user', {
					user: req.user
				})
				
				res.redirect('/users/welcome?access_token=' + storeAccessToken(req, res, user))
			}
		})
	})

	app.route('/users')
	.get((req, res) => {
		User.find({}).exec(function (error, users) {
			if (error) {
				console.log('Get error: ' + error)
			}

			res.status(200).json(users)

			// res.render('./user/users', {
			// 	users: users,
			// 	isAdmin: true,
			// 	userActive: true
			// })
		})
	})
}