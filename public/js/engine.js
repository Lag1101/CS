/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:11
 * To change this template use File | Settings | File Templates.
 */

var auxiliary = (auxiliary || (auxiliary = require('./auxiliary')) );

var engine = {};
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

    engine.UnitProperties = function(id, symbol){
            this.id = id;
            this.symbol = symbol;
    };

    engine.CeilProperties = function(id, symbol, friction){
            this.id = id;
            this.symbol = symbol;
            this.friction = friction ? friction : 1.0;
    };

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

    engine.Ceil = function( type ){
            this.type = type;
    };

    engine.Field = function( width, height ){
            this.width = width;
            this.height = height;
            this.map = [];

            for( var y = 0; y < height; y++ )
            {
                var line = [];
                for( var x = 0; x < width; x++ ) line.push( new engine.Ceil( auxiliary.clone(auxiliary.GetRandom(engine.Fields)) ));
                this.map.push(line);
            }
    };

    engine.Coordinate = function(x,y){
            this.x = x;
            this.y = y;
    };

    engine.Unit = function(type, position) {
            this.see_range = 5.0;
            this.speed = 0.01;
            this.type = type;
            this.destination = null;
            this.position = position;
    };
    /**
     * @return {number}
     */
    engine.HowUnitCanSeeThis = function(unit, position) {
        var distance = engine.distance(unit.position, position);

        if( distance >= unit.see_range ) {
            return 0;
        } else {
            return (unit.see_range - distance) / unit.see_range;
        }
    };
    engine.distance = function(p1, p2) {
        //return Math.abs( p1.x-p2.x ) + Math.abs( p1.y-p2.y );
        return Math.sqrt( Math.pow( p1.x-p2.x, 2 ) + Math.pow( p1.y-p2.y, 2 ));
    };

    engine.Bullet = function(position, direction) {
        this.position = position;
        this.angle = direction;
        this.speed = 0.03;
        this.speedComponents = {
            x: this.speed * Math.cos(this.angle),
            y: this.speed * Math.sin(this.angle)
        }
    };

    engine.Game = function(fieldWidth, fieldHeight, timeStep) {
            this.id = '';
            this.players = [];
            this.bullets = [];
            this.timeIntervalDescriptor = 0;
            this.world = new engine.Field(fieldWidth, fieldHeight);
            this.timeStep = timeStep;
    };

    engine.Player = function(team, game){
            this.team = team;
            this.linkToGame = game;
    };

    engine.Situation = function() {
        this.team = [];
        this.bullets = [];
    };
})(engine);

try{
    module.exports = engine;
    console.log("It's server, Brother");
}catch(e)
{
    console.log("It's browser, Brother");
}

