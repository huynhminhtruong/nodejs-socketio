var http = require('http');
var finalhandler = require('finalhandler');
var Router = require('router');
var bodyParser = require('body-parser');
var compression = require('compression');
var hostname = 'localhost';
var port = '9000';
var router = Router({ mergeParams: true });

var server = http.createServer(function(req,res){
	// No using router module
	// if(req.method == 'GET' && req.url == '/messages'){
	// 	res.writeHead(200, {
	// 		'Content-Type': 'text/html; charset=utf-8',
	// 		'X-Powered-By': 'TruongHM'
	// 	});

	// 	res.write('<h1>');
	// 	res.write('NodeJS Server');
	// 	res.write('</h1>');

	// 	res.end();
	// }else{
	// 	res.statusCode = 200;
	// 	res.write('<h1>Requesting no exist API</h1>');
	// 	res.end();
	// }

	// Using router module
	// req.on('error', function(error){
	// 	console.log(error);
	// }).on('data', function(chunk){
	// 	body.push(chunk);
	// }).on('end', function(){
	// 	res.writeHead(200, {
	// 		'Content-Type': 'text/html; charset=utf-8',
	// 		'X-Powered-By': 'TruongHM'
	// 	});

	// 	res.write('<h1>');
	// 	res.write('NodeJS Server');
	// 	res.write('</h1>');

	// 	res.end();
	// });

	router(req,res,finalhandler(req,res));
});

router.use(compression());

// Router is route another page
// API is call HTTP METHODS such as PUT POST PATCH DELETE

var api = Router();
router.use('/api', api);
api.use(bodyParser.json());

router.get('/index', function(req,res){
	// If not set status code is 200, it will get error
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.end('<h2>Using Router</h2>');
});

api.patch('/about', function(req,res){
	var message = req.body.value;
	res.statusCode = 200;
	// Need to render data as HTML format
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(message + '\n');
});

router.get('params', function(req,res){
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.end('<h2>Get params ' + req.params.name + '</h2>');
});

server.listen(port, hostname, function(){
	console.log('Server is running on host ' + hostname + ': ' + port);
});