module.exports = function(app, io){
	const User = require('../models/user'), 
		Image = require('../models/image'), 
		fs = require('fs'), 
		multer = require('multer'), 
		uploads = multer({dest: './public/uploads'}).single('file');

	app.get('/', (req,res) => {
		Image.find({}).exec(function(error, images){
			res.render('./login', {
				images: images,
				method: '/signin',
				title: 'Please sign in',
				email: 'Email address',
				password: 'Passwprd',
				action: 'Sign in'
			});
		});
	});

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

	app.get('/users/:id', (req,res) => {
		User.findById({_id: req.params.id}).exec(function(error,user){
			res.render('./welcome', {
				user: user
			});
		});
	});

	app.post('/signin', uploads, (req,res) => {
		const email = req.body.email
		const password = req.body.password

		User.findOne({email: email}).exec(function(error, user){
			if (error) {
				console.log(error);
			}
			if(user.validPassword(password)){
				res.redirect('/users/' + user._id);
			}

			res.redirect('/');
		});
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