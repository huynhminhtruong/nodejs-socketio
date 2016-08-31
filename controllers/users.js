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

	app.route('/users')
	.get(function(req,res){
		User.find({}).exec(function(error, users){
			if(error){
				console.log('Get error: ' + error);
			}
			res.render('./users', {
				users: users
			});
		});
	}).post(uploads, function(req,res){
		var name = req.body.name, 
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

	app.get('/users/:id', function(req,res){
		var mongoose = require('mongoose');
		User.findById({_id: req.params.id}).exec(function(error,user){
			res.render('./welcome', {
				user: user
			});
		});
	});

	app.post('/signin', function(req,res){
		var email = req.body.email;
		var password = req.body.password;

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

	app.get('/new', function(req,res){
		res.render('./register', {
			title: '',
			email: '',
			avatar: ''
		});
	});

	app.route('/images')
	.get(function(req,res){
		Image.find({}, function(error, images){
			res.render('./images', {
				images: images
			});
		});
	}).post(uploads, function(req,res,next){
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

	app.route('/emails')
	.get(function(req,res){
		res.render('./email', {});
	}).post(function(req,res){
		
	});
}