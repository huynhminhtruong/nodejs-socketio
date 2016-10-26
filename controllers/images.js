const Image = require('../models/image')

module.exports = function(app, io) {
	app.route('/images')
	.get((req,res) => {
		Image.find({}, function(error, images){
			res.render('./images', {
				images: images
			})
		})
	}).post(uploads, (req,res,next) => {
		const image = new Image()

		image.name = req.body.name
		image.image = 'data:image/png;base64,' 
		+ fs.readFileSync(req.file.path).toString('base64')

		image.save(function(error, img) {
			// Remove file in uploads folder
			fs.unlink(req.file.path)
			res.redirect('images')
		})
	})
}