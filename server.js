var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config/index')
var log = require('./libs/log')(module);
var engine = require("./public/js/engine");
require("./public/js/engine_methods");


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


var game = new engine.Game(10,10,20);
var player = new engine.Player(engine.CreateTeam(5), game);
game.AddPlayer(player);

game.Start();

server.get('/WASUP', function(req, res, next) {
    var situation = new engine.Situation();

    situation.team = player.team;

    res.json(situation);
    res.end('ok');
})
server.post('/JDI', function(req, res) {
    var team = '';
    req
        .on('readable', function(){
            team += req.read();
        })
        .on('end', function(){
            team = JSON.parse(team);
            for( var i = 0; i < player.team.length; i++ ) {
                player.team[i].SetDestination( team[i].destination );
            }
            //console.log(JSON.stringify(player.team))
            res.end('ok');
        })
})

server.use(express.static(path.join(__dirname, 'public')));

http.createServer(server).listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});