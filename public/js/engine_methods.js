/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 23.09.13
 * Time: 22:20
 * To change this template use File | Settings | File Templates.
 */

var async = require('async');
var engine = require('./engine');
var auxiliary = require('./auxiliary');

(function (engine) {
    (function(Game){
        Game.prototype.Live = function() {
            var g = this;

            async.each(g.players, function(player, callback) {
                    player.team.forEach(function( unit ) {
                        unit.Live( g.timeStep, g.world );
                    });
                },
                function(err) {
                    console.error( "Хьюстон, у нас проблемы!" + err.message);
                });

        };
        Game.prototype.Start = function() {
            var g = this;
            this.timeIntervalDescriptor = setInterval( function(){g.Live();}, g.timeStep );
        };
        Game.prototype.Stop = function() {
            if( this.timeIntervalDescriptor ) clearInterval( this.timeIntervalDescriptor );
        };
        Game.prototype.AddPlayer = function(player) {
            var g = this;
            g.players.push(player);
        };
    })(engine.Game || (engine.Game = {}));
    (function(Unit){
        Unit.prototype.IsNear = function( distance ) {
            return distance < 0.1 ? true : false;
        }
        Unit.prototype.Live = function( time, world) {
            // live
            this.Move( time, world );
        };
        Unit.prototype.Move = function( time, world ) {
            if( this.destination === null ) return;

            var total_distance = engine.distance( this.position, this.destination );

            if( this.IsNear( total_distance ) ) {
                this.destination = null;
                return;
            }

            var current_ceil = world.get( Math.floor( this.position.x), Math.floor( this.position.y ) );
            var speed = this.speed / current_ceil.type.friction;
            var dir = { x: (this.destination.x - this.position.x)/total_distance,
                        y: (this.destination.y - this.position.y)/total_distance };

            var distance_per_time = speed * time;

            if( total_distance <= distance_per_time ) {
                this.position = auxiliary.clone( this.destination );
                this.destination = null;
            } else {
                var speed_vector = {x: speed * dir.x,
                                    y: speed * dir.y};

                this.position.x += speed_vector.x * time;
                this.position.y += speed_vector.y * time;
            }
        };
        Unit.prototype.SetDestination = function(destination) {
            this.destination = destination;
        }
    })(engine.Unit);

    engine.CreateTeam = function(teammates_count) {
        var team = [];

        for( var i = 0; i < teammates_count; i++ ) team.push( new engine.Unit(auxiliary.clone(auxiliary.GetRandom(engine.Units)), new engine.Coordinate(Math.random(), Math.random())) );

        return team;
    };

    engine.distance = function(p1, p2) {
        //return Math.abs( p1.x-p2.x ) + Math.abs( p1.y-p2.y );
        return Math.sqrt( Math.pow( p1.x-p2.x, 2 ) + Math.pow( p1.y-p2.y, 2 ));
    };

    (function(Field){
        Field.prototype.get = function(x, y){
            if( x < 0 || x >= this.width || y < 0 || y >= this.height )
                throw new Error( "Coordinates aren't correct: " + x.toString() + " " + y.toString() );
            return this.map[y][x];
        };
    })(engine.Field);


})(engine);


