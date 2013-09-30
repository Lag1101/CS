var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config/index')
var log = require('./libs/log')(module);
var engine = require("./public/js/engine");
var url = require('url')
require("./public/js/engine_methods");
var Transport = require("./public/js/commands");

//var mogoose = require("./libs/mongoose");
//var MongoStore = require('connect-mongo')(express);


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

/*server.use(express.session({
    secret: config.get('session:secret'),   //9xz8hz49d8hz49r8hz4r9.SHA256
    key: config.get('session:sid'),
    cookie: config.get('session:cookie')
    //store: new MongoStore({mongoose_connection: mongoose.connection})
}));    */

server.use(server.router);
server.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Test'
    });
});

var game = new engine.Game(32,32,30);
var player = new engine.Player(engine.CreateTeam(5, 0, 0), game);
var defaultEnemy = new engine.Player(engine.CreateTeam(1, 8, 8), game);
game.AddPlayer(player);
game.AddPlayer(defaultEnemy);
//game.bullets.push(new engine.Bullet(new engine.Coordinate(0,1), 0));

game.Start();

server.get('/create_world', function(req, res) {
    res.json(game.field);
    res.end('ok');
});
server.get('/team', function(req, res) {
    var params = url.parse(req.url, true, true);
    switch( params.query.do ) {
        case 'update':
            res.json(player.team);
            break;
        case 'visible':
            var enemies = [];
            enemies = game.GetVisibleUnitsForPlayer(player);
            res.json(enemies);
            break;
    }
    res.end('ok');
});
server.get('/bullets', function(req, res) {
    res.json(game.bullets);
    res.end('ok');
});

server.post('/JDI', function(req, res) {
    var message = '';
    req
        .on('readable', function(){
            message += req.read();
        })
        .on('end', function(){
            message = Transport.decode(message);

            switch(message.what) {
                case Transport.commands.move:
                    if(player.team[message.who])
                        player.team[message.who].SetDestination( message.target );
            }
            //console.log(JSON.stringify(player.message))
            res.end('ok');
        })
})

server.use(express.static(path.join(__dirname, 'public')));

http.createServer(server).listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});