const authentication = require('../config/authentication')

module.exports = function(app, io){
	app.get('/chat', authentication.verify, (req, res) => {
		res.render('./contact/chat', {
			title: 'Tell the world',
			action: 'Send',
			contactActive: true,
			id: req.user._id,
			name: req.user.name,
			image: req.user.avatar
		})
	})

	var chat = io.of('/chat').on('connection', function(socket){
		socket.emit('start chatting', {message: 'Welcome to my world'})
		socket.on('chat messages', function(data) {
			chat.emit('server messages', {
				user: data.name,
				id: data.id,
				message: data.message,
				image: data.image
			})
		})
	})
}