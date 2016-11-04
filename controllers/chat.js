const authentication = require('../config/authentication'), 
		User = require('../models/user')

module.exports = function(app, io){
	app.get('/create', authentication.verify, (req, res) => {
		res.redirect('/chat/' + req.user._id)
	})

	app.get('/chat/:id', authentication.verify, (req, res) => {
		User.find({}).exec(function (error, users) {
			if (error) {
				console.log('Get error: ' + error)
			}

			res.render('./contact/chat', {
				action: 'Send',
				contactActive: true,
				users: users,
				id: req.user._id,
				name: req.user.name,
				image: req.user.avatar
			})
		})
	})

	var chat = io.of('/chat').on('connection', function(socket){
		socket.on('login', function(room){
			console.log('socket ', socket.id, 'join room', room)

			socket.join(room)
		})

		socket.on('ferret', function(name, fn){
			fn('woot')
		})

		socket.emit('new connection', { 
			message: "Hi new user! Let's start chatting with someone" 
		})

		socket.on('chat messages', function(data) {
			console.log('sending room post', data.room)

			// Send private message to other sockets in room except sender
			// socket.broadcast.to(data.room).emit('server messages', {
			// 	user: data.name,
			// 	id: socket.id,
			// 	message: data.message,
			// 	image: data.image
			// })

			// Send message to all sockets in room include sender
			chat.in(data.room).emit('server messages', {
				user: data.name,
				id: socket.id,
				message: data.message,
				image: data.image
			})
		})
	})
}