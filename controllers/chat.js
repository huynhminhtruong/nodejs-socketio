const authentication = require('../config/authentication'), 
		User = require('../models/user')

module.exports = function(app, io){
	app.get('/create', authentication.verify, authentication.isAdmin, (req, res) => {
		res.redirect('/chat/' + req.user._id)
	})

	app.get('/chat/:id', authentication.verify, authentication.isAdmin, (req, res) => {
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
		socket.on('login', function(data){
			console.log('socket ', socket.id, 'connecting on', data.connectId)

			socket.join(data.connectId)

			socket.broadcast.emit('users online', {
				userId: data.userId, 
				connectId: data.connectId
			})
		})

		socket.on('connect to client', function(client){
			console.log('socket ', socket.id, 'connect to client', client)

			socket.join(client)
		})

		socket.on('ferret', function(name, fn){
			fn('woot')
		})

		socket.on('chat messages', function(data) {
			console.log('sending room post', data.name)

			// Send private message to other sockets in room except sender
			socket.broadcast.to(data.receiver).emit('private messages', {
				sender: data.sender,
				receiver: data.receiver,
				message: data.message,
				image: data.image
			})

			// Send message to all sockets in room include sender
			chat.in(data.receiver).emit('server messages', {
				sender: data.sender,
				receiver: data.receiver,
				message: data.message,
				image: data.image
			})
		})
	})
}