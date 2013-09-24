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
var MongoStore = require('connect-mongo')(express);


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
})


var game = new engine.Game(10,10,3);
var player = new engine.Player(engine.CreateTeam(5), game);
game.AddPlayer(player);

game.Start();

server.get('/create_world', function(req, res) {
    res.json(game.world);
    res.end('ok');
});
server.get('/team', function(req, res) {
    var params = url.parse(req.url, true, true);
    switch( params.query.do ) {
        case 'update':
            var coordinates = Transport.TeamCoordinatesToArray(player.team);
            res.json(coordinates);
            break;
        case 'create':
            res.json(player.team);
            break;
    }
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