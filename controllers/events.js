var events = require('events');
var eventEmitter = new events.EventEmitter();
var fs = require('fs');
var readStream = fs.createReadStream('./text');
var writeStream = fs.createWriteStream('./out');

var printFile = function(done){
	fs.readFile('./text', function(error, result){
		done(result);
	});
}

var writeFile = function(done){
	fs.writeFile('./text', 'Hello NodeJS', 'utf-8', function(error){
		done();
	});
}

var data = '';

// readStream.on('data', function(chunk){
// 	data += chunk;
// });

// readStream.on('readable', function(){
// 	console.log('Start: ' + Date.now());
// 	while((chunk = readStream.read()) != null){
// 		writeStream.write(chunk);
// 	}
// 	console.log(Date.now());
// });

console.log('Start: ' + Date.now());
readStream.pipe(writeStream);
console.log(Date.now());

readStream.on('end', function(){
	console.log(data);
});

console.log('Finish ' + Date.now());