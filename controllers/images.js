const Image = require('../models/image'), 
		fs = require('fs'), 
		multer = require('multer'), 
		uploads = multer({dest: './public/uploads'}).single('file'), 
		authentication = require('../config/authentication')

function render(res, template, object) {
	res.render(template, object);
}

module.exports = function(app, io) {
	app.route('/images')
	.get(authentication.verify, authentication.isAdmin, (req,res) => {
		res.addScript('/js/image.js')
		
		Image.find({}, function(error, images){
			res.render('./image/images', {
				images: images,
				imageActive: true
			})
		})
	})

	app.route('/images/add')
	.get(authentication.verify, authentication.isAdmin, (req,res) => {
		var template = './image/new', object = {
			method: '/images/add',
			title: 'Upload your picture',
			description: 'Your description',
			action: 'Upload'
		}
		render(res, template, object)
	}).post(uploads, (req,res) => {
		const image = new Image()

		image.name = req.body.name
		image.image = 'data:image/png;base64,' 
		+ fs.readFileSync(req.file.path).toString('base64')

		// res.status(200).json(req.user)

		image.save(function(error, img) {
			// Remove file in uploads folder
			fs.unlink(req.file.path)
			res.redirect('/images')
		})
	})
}