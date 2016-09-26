module.exports = function(app, io) {
	app.route('/emails')
	.get((req,res) => {
		res.render('./email', {})
	}).post((req,res) => {
		
	})
}