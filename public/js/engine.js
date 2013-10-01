/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:11
 * To change this template use File | Settings | File Templates.
 */

var auxiliary = (auxiliary || (auxiliary = require('./auxiliary')) );
var stats = (stats || (stats = require('./stats')) );

var engine = {};
(function (engine) {


    engine.Field = function( width, height ){
            this.width = width;
            this.height = height;
            this.map = [];

            for( var y = 0; y < height; y++ )
            {
                var line = [];
                for( var x = 0; x < width; x++ )
                    line.push(
                        stats.Fields[ 'city' ]
                    );
                this.map.push(line);
            }
    };

    engine.Coordinate = function(x,y){
        this.x = x;
        this.y = y;
    };
    engine.NullCoordinate = new engine.Coordinate(-1.0,-1.0);

    engine.Parameter = function( max, min, value ) {
        this.value = value || max;
        this.max = max;
        this.min = min || 0.0;
    };

    engine.Unit = function(stats, position) {
        this.symbol = stats.symbol;
        this.health = new engine.Parameter(stats.max_health);
        this.see_range = stats.see_range;
        this.speed = stats.speed;
        this.destination = engine.NullCoordinate;
        this.position = position;
        this.weapon = new engine.Weapon( stats.weapon );
        this.size = stats.size;
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
    engine.IsUnitAlive = function( unit ) {
        return unit.health.value > 0;
    };
    engine.distance = function(p1, p2) {
        //return Math.abs( p1.x-p2.x ) + Math.abs( p1.y-p2.y );
        return Math.sqrt( Math.pow( p1.x-p2.x, 2 ) + Math.pow( p1.y-p2.y, 2 ));
    };

    engine.Bullet = function(position, direction, damage, speed) {
        this.position = position;
        this.angle = direction;
        this.speed = speed;
        this.damage = damage;
        this.speedComponents = {
            x: this.speed * Math.cos(this.angle),
            y: this.speed * Math.sin(this.angle)
        }
    };

    engine.Weapon = function(stats) {
        this.rounds_to_ready = 0;
        this.rounds_to_end_reload = 0;
        this.ammo = new engine.Parameter(stats.ammo_capacity);
        this.stats = stats;
    };

    engine.Game = function(fieldWidth, fieldHeight, timeStep) {
            this.id = '';
            this.players = [];
            this.bullets = [];
            this.timeIntervalDescriptor = 0;
            this.field = new engine.Field(fieldWidth, fieldHeight);
            this.timeStep = timeStep;
    };

    engine.Player = function(team, game){
            this.team = team;
            this.linkToGame = game;
    };

    engine.World = function(team, enemies, bullets, field) {
        this.team = team || [];
        this.enemies = enemies || [];
        this.bullets = bullets || [];
        this.field = field || {};
    };

    engine.CreateTeam = function(teammates_count, x, y) {
        var team = [];

        x = x || 0;
        y = y || 0;

        for( var i = 0; i < teammates_count; i++ )
            team.push(
                new engine.Unit(( stats.Units[ auxiliary.GetRandom(stats.Units.keys) ] ),
                new engine.Coordinate(x + Math.random(), y + Math.random()))
            );

        return team;
    };
})(engine);

try{
    module.exports = engine;
    console.log("It's server, Brother");
}catch(e)
{
    console.log("It's browser, Brother");
}

