module.exports = function(app, io){
	const User = require('../models/user'), 
		Image = require('../models/image'), 
		fs = require('fs'), 
		multer = require('multer'), 
		uploads = multer({dest: './public/uploads'}).single('file'), 
		jwt = require('jsonwebtoken')

	function auth(req,res,next){
		const token = req.session.authorization

		if (token) {
			jwt.verify(token, app.get('supersecret'), function(error, decode){
				req.user = decode.user
				next()
			})
		} else {
			res.json({
				success: true, 
				message: 'Please login first'
			})
		}
	}

	function getToken(req,res,next){
		next()
	}

	app.get('/', auth, (req,res) => {
		res.redirect('/user')
	});

	app.route('/login')
	.get((req,res) => {
		res.render('./login', {
			method: '/login',
			title: 'Please sign in',
			email: 'Email address',
			password: 'password',
			action: 'Sign in'
		});
	}).post(uploads, (req,res) => {
		User.findOne({email: req.body.email}).exec(function(error, user){
			if (error) {
				next(error)
			}
			if(user.validPassword(req.body.password)){
				var token = jwt.sign({
					user: user
				}, app.get('supersecret'))

				req.session.authorization = token
				res.status(200).json({token})
				// res.redirect('/user')
			}
			res.redirect('/')
		})
	})

	app.route('/users')
	.get((req,res) => {
		User.find({}).exec(function(error, users){
			if(error){
				console.log('Get error: ' + error);
			}
			res.render('./users', {
				users: users
			});
		});
	}).post(uploads, (req,res) => {
		const name = req.body.name, 
			email = req.body.email,
			password = req.body.password, 
			file = 'data:image/png;base64,' 
			+ fs.readFileSync(req.file.path).toString('base64'), 
			user = new User();

		user.name = name;
		user.email = email;
		user.generatePassword(password);
		user.avatar = file;

		user.save(function(error, user){
			res.redirect('/users/' + user._id);
		});
	});

	app.get('/user', auth, (req,res) => {
		res.render('./welcome', {
			user: req.user
		})
	});

	app.get('/new', (req,res) => {
		res.render('./register', {
			method: '/users',
			title: 'Register New Account',
			email: 'Your email',
			password: 'Your password',
			action: 'Register'
		});
	});

	app.route('/images')
	.get((req,res) => {
		Image.find({}, function(error, images){
			res.render('./images', {
				images: images
			});
		});
	}).post(uploads, (req,res,next) => {
		const image = new Image();
		image.name = req.body.name;
		image.image = 'data:image/png;base64,' 
		+ fs.readFileSync(req.file.path).toString('base64');

		image.save(function(error, img){
			// Remove file in uploads folder
			fs.unlink(req.file.path);
			res.redirect('images');
		});
	});

	app.route('/emails')
	.get((req,res) => {
		res.render('./email', {});
	}).post((req,res) => {
		
	});
}