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

function Live(world) {
     world;
}

(function (engine) {
    (function(World){
        World.prototype.SetMyTeam = function(team) {
            this.team = team;
        };
    })(engine.World || (engine.World = {}));
    (function(Game){
        Game.prototype.Live = function() {
            var g = this;

            async.each(g.players, function(player) {
                    player.team.forEach(function( unit ) {
                        unit.Live( g.timeStep, g.field );
                        //unit.Fire( 0, g.bullets );
                    });
                },
                function(err) {
                    throw err;
                });
            for(var i = 0; i < g.bullets.length; )
            {
                var bullet = g.bullets[i];
                bullet.Live( g.timeStep, g.field );
                if( !auxiliary.isInBounds(bullet.position.x, 0, g.field.width) ||
                    !auxiliary.isInBounds(bullet.position.y, 0, g.field.height) )
                    g.bullets.splice(i,1);
                else
                    i++;
            }
            async.each( g.players,
                function( player ){
                    Live(new engine.World(
                        player.team,
                        g.GetVisibleUnitsForPlayer(player),
                        g.bullets,
                        g.field
                    ));
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
        Game.prototype.GetVisibleUnitsForPlayer = function( player ) {
            var visibleUnits = [];

            this.players.forEach( function( anotherPlayer ) {
                if( player !== anotherPlayer ) {

                    for( var i = 0; i < anotherPlayer.team.length; i++ ){
                        var anotherUnit = anotherPlayer.team[i];

                        for( var j = 0; j < player.team.length; j++ ){
                             var unit = player.team[j];
                             if( engine.HowUnitCanSeeThis(unit, anotherUnit.position) > 0 )
                             {
                                 visibleUnits.push(anotherUnit);
                                 break;
                             }
                        }
                    }
                }
            } );

            return visibleUnits;
        };
    })(engine.Game || (engine.Game = {}));
    (function(Unit){
        /**
         * @return {boolean}
         */
        Unit.prototype.IsNear = function( distance ) {
            return distance < 0.1;
        };
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
        Unit.prototype.SetDestination = function (destination) {
            this.destination = destination;
        };
        Unit.prototype.Fire = function( direction, bulletPool ) {
            var bullet = new engine.Bullet( auxiliary.clone(this.position), direction);
            bulletPool.push(bullet);
        }
    })(engine.Unit);

    (function(Bullet){
        Bullet.prototype.Live = function(time, world) {
            this.position.x += this.speedComponents.x * time;
            this.position.y += this.speedComponents.y * time;
        }
    })(engine.Bullet);

    (function(Field){
        Field.prototype.get = function(x, y){
            if( x < 0 || x >= this.width || y < 0 || y >= this.height )
                throw new Error( "Coordinates aren't correct: " + x.toString() + " " + y.toString() );
            return this.map[y][x];
        };
    })(engine.Field);


})(engine);


