
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , newuser=require('./routes/newuser')
  , login=require('./routes/login')
  , http = require('http')  
  , path = require('path')
  , session = require('client-sessions');

var app = express();

app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); 
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/users', user.list);
app.post('/login',newuser.login);
app.get('/homepage',login.home);
app.post('/signup',user.signup);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io')(server);
var sockets = [];
io.on('connection', function (socket) {

	sockets.push(socket);

	/*
	console.log(socket);
	console.log("****************");
	console.log(io);
	console.log("*****************");
	*/
	//console.log('Started the client socket.');
	//socket.emit('livestream', {for: 'everyone'});

	//

	socket.on('data', function(data)	{
		console.log("Data received at server : "+data);
        for (var i = 0; i < sockets.length; i++)	{
			if(sockets[i] != socket)	{
				sockets[i].emit('data', data)
			}
		}
	});

	/*
	socket.on('livestream', function(data){
		console.log(data);
		//TODO sort the data based on client's location
		io.emit('clientChannel', data);
	});*/

	socket.emit('clientChannel', new Date() + 'Connection established');
});
