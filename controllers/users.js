const User = require('../models/user'), 
		fs = require('fs'), 
		multer = require('multer'), 
		uploads = multer({dest: './public/uploads'}).single('file'), 
		authentication = require('../config/authentication')

function storeAccessToken(req, res, user) {
	req.session.authorization = authentication.generateToken(req, res, user)

	return authentication.generateToken(req, res, user)
}

module.exports = function(app, io){
	// app.get('/', authentication.verify, (req, res) => {
	//     res.redirect('/users/welcome?access_token=' + req.session.authentication)
	// })

	app.get('/', (req, res) => {
		res.render('./about/about', {})
	})

	app.route('/logout').get((req,res) => {
		
	}).post((req,res) => {
		
	})

	app.route('/login')
	.get((req,res) => {
		if (req.headers.authorization || req.session.authorization) {
			return res.status(200).json(req.user)
		}

		res.render('./login', {
			method: '/login',
			title: 'Please sign in',
			email: 'Email address',
			password: 'password',
			action: 'Sign in',
			isRegister: false
		})
	}).post(uploads, (req, res) => {
		User.findOne({email: req.body.email}).exec(function(error, user){
			if (error) {
				next(error)
			}
			if (user.validPassword(req.body.password)) {
				res.redirect('/users/welcome?access_token=' + storeAccessToken(req, res, user))
			}
		})
	})

	app.get('/users/welcome', authentication.verify, (req, res) => {
		res.render('./user/welcome', {
			user: req.user
		})
	})

	app.get('/users/profile', authentication.verify, (req, res) => {
		res.render('./user/profile', {
			user: req.user
		})
	}).post((req, res) => {

	})

	app.route('/users/new')
	.get((req, res) => {
		res.render('./user/register', {
			method: '/users/new',
			title: 'Register New Account',
			name: 'Your name', 
			email: 'Your email',
			password: 'Your password',
			action: 'Register',
			isRegister: true
		})
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
			res.redirect('/users/welcome?access_token=' + storeAccessToken(req, res, user))
		})
	})

	app.route('/users/dashboard').get(authentication.verify, (req, res) => {
		res.addScript('/js/dashboard.js')

		var types = [
			{
				icon: 'fa fa-fw fa-info-circle',
				type: 'information',
				isActive: 'active'
			}, {
				icon: 'fa fa-fw fa-list',
				type: 'users'
			}, {
				icon: 'fa fa-fw fa-table',
				type: 'post'
			}
		]

		res.render('./user/dashboard', {
			types: types
		})
	}).post((req, res) => {
		
	})

	app.route('/users')
	.get((req, res) => {
		User.find({}).exec(function (error, users) {
			if (error) {
				console.log('Get error: ' + error)
			}
			res.render('./user/users', {
				users: users,
				isAdmin: true
			})
		})
	})
}