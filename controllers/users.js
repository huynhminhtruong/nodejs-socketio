module.exports = function(app, io){
	const User = require('../models/user'), 
		Image = require('../models/image'), 
		fs = require('fs'), 
		multer = require('multer'), 
		uploads = multer({dest: './public/uploads'}).single('file');

	app.get('/', function(req,res){
		Image.find({}).exec(function(error, images){
			res.render('./home', {
				images: images
			});
		});
	});

	app.get('/users', function(req,res){
		User.find({}).populate('avatar').exec(function(error, users){
			if(error){
				console.log('Get error: ' + error);
			}
			res.render('./users', {
				users: users
			});
		});
	});

	app.get('/users/:id', function(req,res){
		const mongoose = require('mongoose');
		User.findById({_id: req.params.id})
		.populate('avatar').exec(function(error,user){
			res.render('./welcome', {
				user: user
			});
		});
	});

	app.get('/new', function(req,res){
		res.render('./register', {
			title: '',
			email: '',
			avatar: ''
		});
	});

	app.post('/users', uploads, function(req,res){
		const name = req.body.name, 
			email = req.body.email,
			password = req.body.password, 
			file = 'data:image/png;base64,' 
			+ fs.readFileSync(req.file.path).toString('base64'), 
			user = new User(), crypto = require('crypto');

		const randomString = function(length){
			return crypto.randomBytes(Math.ceil(length/2)).toString('base64').slice(0, length);
		}

		const sha512 = function(password, salt){
			const hash = crypto.createHmac('sha512', salt);
			hash.update(password);
			const value = hash.digest('base64');

			return {
				salt: salt,
				hash: value
			}
		}

		const salt = randomString(16);
		const hash = sha512(password, salt).hash;

		user.name = name;
		user.email = email;
		user.password = password;
		user.passwordSalt = salt;
		user.passwordHash = hash;

		user.save(function(error, user){
			res.redirect('/users/' + user._id);
		});
	});

	app.get('/images', function(req,res){
		Image.find({}, function(error, images){
			res.render('./images', {
				images: images
			});
		});
	});

	app.post('/images', uploads, function(req,res,next){
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

	app.get('/emails', function(req,res){
		res.render('./email', {});
	});
}