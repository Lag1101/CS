/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:11
 * To change this template use File | Settings | File Templates.
 */

var auxiliary = (auxiliary || (auxiliary = require('./auxiliary')) );

var engine;
(function (engine) {
    engine.UnitType = {
        sniper:'sniper',
        engineer:'engineer',
        soldier:'soldier'
    };
    engine.GroundType = {
        forest:'forest',
        city:'city',
        tower:'tower'
    };

    engine.UnitProperties = (function(){
        function UnitProperties(id, symbol){
            this.id = id;
            this.symbol = symbol;
        }
        return UnitProperties;
    })();

    engine.CeilProperties = (function(){
        function CeilProperties(id, symbol, friction){
            this.id = id;
            this.symbol = symbol;
            this.friction = friction ? friction : 1.0;
        }
        return CeilProperties;
    })();

    engine.Fields = [
        new engine.CeilProperties(engine.GroundType.forest,    'rgba(255,0,255,0.5)',   2.0),
        new engine.CeilProperties(engine.GroundType.city,      'rgba(255,255,0,0.5)',   0.5),
        new engine.CeilProperties(engine.GroundType.tower,     'rgba(0,255,255,0.5)',   1.0)
    ];
    engine.Units = [
        new engine.UnitProperties(engine.UnitType.sniper,   'rgba(255,0,0,1.0)'),
        new engine.UnitProperties(engine.UnitType.engineer, 'rgba(0,0,255,1.0)'),
        new engine.UnitProperties(engine.UnitType.soldier,  'rgba(0,255,0,1.0)')
    ];

    engine.Ceil = (function(){
        function Ceil( type ){
            this.type = type;
        }
        return Ceil;
    })();

    engine.Field = (function(){
        function Field( width, height ){
            this.width = width;
            this.height = height;
            this.map = [];

            for( var y = 0; y < height; y++ )
            {
                var line = [];
                for( var x = 0; x < width; x++ ) line.push( new engine.Ceil( auxiliary.clone(auxiliary.GetRandom(engine.Fields)) ));
                this.map.push(line);
            }
        }
        return Field;
    })();

    engine.Coordinate = (function(){
        function Coordinate(x,y){
            this.x = x;
            this.y = y;
        }
        return Coordinate;
    })();

    engine.Unit = (function(){
        function Unit(type, position) {
            this.see_range = 10.0;
            this.speed = 0.01;
            this.type = type;
            this.destination = null;
            this.position = position;
        }
        return Unit;
    })();

    engine.Game = (function(){
        function Game(fieldWidth, fieldHeight, timeStep) {
            this.id = '';
            this.players = [];
            this.timeIntervalDescriptor = null;
            this.world = new engine.Field(fieldWidth, fieldHeight);
            this.timeStep = timeStep;
        }
        return Game;
    })();

    engine.Player = (function(){
        function Player(team, game){
            this.team = team;
            this.linkToGame = game;
        }
        return Player;
    })();

    engine.Situation = (function() {
        function Situation() {
            this.team = [];
        }
        return Situation;
    })();
})(engine || (engine = {}));

try{
    module.exports = engine;
    console.log("It's server, Brother");
}catch(e)
{
    console.log("It's browser, Brother");
}

