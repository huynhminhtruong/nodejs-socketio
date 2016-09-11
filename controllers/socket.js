var net = require('net');

var server = net.createServer(function(socket){
	socket.write('Server is opening');
	socket.pipe(socket);
});

server.listen(8080, 'localhost', function(){
	console.log('Server is running on port ' + 8080);
	console.log(__dirname);
	console.log(__filename);
});