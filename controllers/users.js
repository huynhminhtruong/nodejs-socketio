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
			email: 'Your email', 
			password: 'Password', 
			actions: [{name: 'Sign in', type: 'submit'}]
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

	app.get('/users/welcome', authentication.verify, authentication.isAdmin, (req, res) => {
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
		res.render('./user/register', {
			method: '/users/new',
			title: 'Register New Account',
			name: 'Your name', 
			email: 'Your email',
			password: 'Your password',
			actions: [{name: 'Register'}],
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

	app.route('/users')
	.get(authentication.verify, authentication.isAdmin, (req, res) => {
		User.find({}).exec(function (error, users) {
			if (error) {
				console.log('Get error: ' + error)
			}
			res.render('./user/users', {
				users: users,
				isAdmin: true,
				userActive: true
			})
		})
	})
}