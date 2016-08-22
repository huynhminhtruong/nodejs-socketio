module.exports = function(app, io){
	var User = require('../models/user');
	var fs = require('fs');

	app.get('/users', function(req,res){
		User.find({}).exec(function(error, users){
			if(error){
				console.log('Get error: ' + error);
			}
			res.send(users);
		});
	});

	app.post('/users', function(req,res){
		var name = req.body.name, 
			email = req.body.email,
			password = req.body.password, 
			file = './public/img/nodejs.png', 
			base64,
			user = new User();

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
}