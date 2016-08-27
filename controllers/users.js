module.exports = function(app, io){
	var User = require('../models/user'), 
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
		var mongoose = require('mongoose');
		User.findById({_id: req.params.id})
		.populate('avatar').exec(function(error,user){
			res.render('./welcome', {
				user: user
			});
		});
	});

	app.post('/users', uploads, function(req,res){
		var name = req.body.name, 
			email = req.body.email,
			password = req.body.password, 
			file = 'data:image/png;base64,' 
			+ fs.readFileSync(req.file.path).toString('base64'), 
			user = new User();

		user.name = name;
		user.email = email;
		user.password = password;

		Image({name: req.file.name,image: file}).save(function(error,image){
			user.avatar = image._id;
			user.save(function(error, user){
				res.redirect('/users/' + user._id);
			});
		});
	});

	app.get('/skills', function(req,res){
		res.render('./skills', {});
	});

	app.post('/skills', uploads, function(req,res){
		var nodejs = './public/img/nodejs.png', 
			mongodb = './public/img/mongodb.png', 
			java = './public/img/java.png', 
			golang = './public/img/golang.png', 
			backbonejs = './public/img/backbonejs.png', base64;

		base64 = 'data:image/png;base64,' + fs.readFileSync(nodejs).toString('base64');

		User.update({email:'huynhminhtruong2003@gmail.com', skills:[base64]}, function(error,status){
			res.render('./about', {});
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
		var image = new Image();
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