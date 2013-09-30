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
    engine.weapons = {
        dragunov: {
            reloading_time: 30,
            dispersion: Math.PI/180.0 * 1.0,
            range: 10.0,
            damage: 100
        },
        AK: {
            reloading_time: 2,
            dispersion: Math.PI/180.0 * 15.0,
            range: 5.0,
            damage: 50
        },
        PM: {
            reloading_time: 10,
            dispersion: Math.PI/180.0 * 10.0,
            range: 3.0,
            damage: 20
        }
    };

    engine.Units = {
        keys: ['sniper', 'engineer', 'soldier'],
        sniper: {
            symbol: 'rgba(0,0,255,1.0)',
            max_health: 100,
            weapon: engine.weapons.dragunov,
            see_range: 7.0,
            speed: 0.0025,
            size: 0.5
        },
        engineer: {
            symbol: 'rgba(0,255,0,1.0)',
            max_health: 50,
            weapon: engine.weapons.PM,
            see_range: 5.0,
            speed: 0.005,
            size: 0.5
        },
        soldier: {
            symbol: 'rgba(255,0,0,1.0)',
            max_health: 150,
            weapon: engine.weapons.AK,
            see_range: 5.0,
            speed: 0.01,
            size: 0.5
        }
    };

    engine.Fields = {
        keys: ['forest','city','tower'],
        forest: {
            symbol: 'rgba(255,0,255,0.5)',
            friction: 2.0
        },
        city: {
            symbol: 'rgba(255,255,0,0.5)',
            friction: 0.5
        },
        tower: {
            symbol: 'rgba(0,255,255,0.5)',
            friction: 1.0
        }
    };

    engine.Field = function( width, height ){
            this.width = width;
            this.height = height;
            this.map = [];

            for( var y = 0; y < height; y++ )
            {
                var line = [];
                for( var x = 0; x < width; x++ )
                    line.push(
                        engine.Fields[ 'city' ]
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

    engine.Unit = function(type, position) {
        this.symbol = type.symbol;
        this.health = new engine.Parameter(type.max_health);
        this.see_range = type.see_range;
        this.speed = type.speed;
        this.destination = engine.NullCoordinate;
        this.position = position;
        this.weapon = type.weapon;
        this.rounds_to_reload = 0;
        this.size = type.size;
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

    engine.Bullet = function(position, direction, damage) {
        this.position = position;
        this.angle = direction;
        this.speed = 0.03;
        this.damage = damage;
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
                new engine.Unit(( engine.Units[ auxiliary.GetRandom(engine.Units.keys) ] ),
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

