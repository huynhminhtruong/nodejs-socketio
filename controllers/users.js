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
	app.get('/', authentication.verify, (req, res) => {
	    res.redirect('/user')
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
				res.redirect('/user?access_token=' + storeAccessToken(req, res, user))
			}
		})
	})

	app.get('/user', authentication.verify, (req, res) => {
		res.render('./welcome', {
			user: req.user
		})
	})

	app.route('/user/new')
	.get((req, res) => {
		res.render('./register', {
			method: '/user/new',
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
			res.redirect('/user?access_token=' + storeAccessToken(req, res, user))
		})
	})

	app.route('/users')
	.get((req, res) => {
		User.find({}).exec(function (error, users) {
			if (error) {
				console.log('Get error: ' + error)
			}
			res.render('./users', {
				users: users
			})
		})
	})
}