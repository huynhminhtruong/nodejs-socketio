module.exports = function(app, io){
	var User = require('../models/user');
	var fs = require('fs');

	app.get('/home', function(req,res){
		res.render('./home');
	});

	app.get('/users', function(req,res){
		User.find({}).exec(function(error, users){
			if(error){
				console.log('Get error: ' + error);
			}
			res.render('./users', {
				users: users
			});
		});
	});

	app.post('/users', function(req,res){
		var name = req.body.name, 
			email = req.body.email,
			password = req.body.password, 
			file = './public/img/nodejs.png', 
			base64,
			user = new User();

		console.log(req.files);

		base64 = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');

		user.avatar = base64;
		user.name = name;
		user.email = email;
		user.password = password;

		user.save(function(error, user){
			res.render('./welcome', {
				user: user
			});
		});
	});

	app.get('/skills', function(req,res){
		res.render('./skills', {});
	});

	app.post('/skills', function(req,res){
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

	app.get('/emails', function(req,res){
		res.render('./email', {});
	});
}