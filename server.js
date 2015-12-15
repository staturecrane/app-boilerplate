var express  = require('express');
var app      = express();
var http = require ('http');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');


var port = 8080;

var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost');

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

var server = http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    
});

app.use('/', express.static(__dirname + '/public'));
