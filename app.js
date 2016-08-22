var express = require('express'),
	app = express(), 
	port = process.env.PORT || 8080, 
	io = require('socket.io').listen(app.listen(port));

require('./config')(app, io);
require('./controllers/users')(app, io);
require('./talk')(app, io);

console.log('Server is running on ' + port);