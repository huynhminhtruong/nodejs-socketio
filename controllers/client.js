var net = require('net');

var client = new net.Socket();

client.connect(8080, 'localhost', function(){
	console.log('Client connected');
	client.write('Hello server');
});

client.on('data', function(data){
	console.log('Receive: ' + data);
	client.destroy();
});

client.on('close', function(){
	console.log('Connect closed');
});