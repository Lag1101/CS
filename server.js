var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config')
var log = require('libs/log')(module);
var engine = require("public/js/engine");


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


var game = new engine.Game(100,100,20);
game.Start();
var players = [];
server.use('/game', function(req, res, next) {
    log.info('One more player');
    var player = new engine.Player(res, engine.CreateTeam(5), game);
    players.push(player);
    res.end("ok");
})
server.get('/situation', function(req, res, next) {
    //log.info('Need inormation!');
    var answer = players.length.toString() + '\n';
    players.forEach( function(player){
        answer += JSON.stringify(player.team) + '\n';
    });
    res.send(answer);
    res.end('ok');
})

server.use(express.static(path.join(__dirname, 'public')));

http.createServer(server).listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});