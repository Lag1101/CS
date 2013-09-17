var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config')
var log = require('libs/log')(module);

var server = express();
server.set('port', config.get('port'));

server.set('views', __dirname + '/templates');
server.set('view engine', 'ejs');
server.use(express.favicon());

if( server.get('env') == 'development' )
    server.use(express.logger('dev'));
else
    server.use(express.logger('default'));

server.use(express.bodyParser()); // parse from POST to rec.body

server.use(express.cookieParser());  // parse to req.cookies

server.use(server.router);
server.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Test'
    });
})

server.use(express.static(path.join(__dirname, 'public')));

http.createServer(server).listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});