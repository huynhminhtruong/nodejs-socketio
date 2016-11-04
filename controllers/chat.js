const authentication = require('../config/authentication')

module.exports = function(app, io){
	app.get('/create', authentication.verify, (req, res) => {
		var room = Math.round((Math.random() * 1000000))

		res.redirect('/chat/' + room)
	})

	app.get('/chat/:id', authentication.verify, (req, res) => {
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
		socket.emit('new connection', { 
			id: socket.id, 
			message: "Hi new user! Let's start chatting with someone" 
		})

		socket.on('chat messages', function(data) {
			socket.broadcast.emit('server messages', {
				user: data.name,
				message: data.message,
				image: data.image
			})
			// chat.emit('server messages', {
			// 	user: data.name,
			// 	id: socket.id,
			// 	message: data.message,
			// 	image: data.image
			// })
		})
	})
}