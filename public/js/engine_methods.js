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
     world.team.forEach(function(unit){
         if( unit.rounds_to_reload <=0 &&
             world.enemies.length > 0 &&
             unit.weapon.range >= engine.distance(unit.position, world.enemies[0].position))
            unit.FireInPoint(world.enemies[0].position, world.bullets);
     });
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
                        if( engine.IsUnitAlive(unit) )
                            unit.Live( g.timeStep, g.field );
                        //unit.FireInDirectionOf( 0, g.bullets );
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

            for(var i = 0; i < g.bullets.length; ) { var bullet = g.bullets[i];
                var victim = bullet.FindMatches(g.players);
                if( victim !== null ) {
                    victim.health.value -= bullet.damage;
                    if( victim.health.value < 0 )
                        victim.health.value = 0;
                    g.bullets.splice(i,1);
                } else {
                    i++;
                }
            }
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
                             if( engine.IsUnitAlive(unit) && engine.HowUnitCanSeeThis(unit, anotherUnit.position) > 0 )
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
            this.rounds_to_reload--;
        };
        Unit.prototype.Move = function( time, world ) {
            if( this.destination == engine.NullCoordinate ) return;

            var total_distance = engine.distance( this.position, this.destination );

            if( this.IsNear( total_distance ) ) {
                this.destination = engine.NullCoordinate;
                return;
            }

            var current_ceil = world.get( Math.floor( this.position.x), Math.floor( this.position.y ) );
            var speed = this.speed / current_ceil.friction;
            var dir = { x: (this.destination.x - this.position.x)/total_distance,
                        y: (this.destination.y - this.position.y)/total_distance };

            var distance_per_time = speed * time;

            if( total_distance <= distance_per_time ) {
                this.position = auxiliary.clone( this.destination );
                this.destination = engine.NullCoordinate;
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
        Unit.prototype.FireInDirectionOf = function( direction, bulletPool ) {
            var position = auxiliary.clone(this.position);
            position.x += this.size*1.1 * Math.cos( direction );
            position.y += this.size*1.1 * Math.sin( direction );
            var bullet = new engine.Bullet(
                position,
                direction + this.weapon.dispersion * ( Math.random() - 0.5 ),
                this.weapon.damage
            );
            bulletPool.push(bullet);
            this.rounds_to_reload = this.weapon.reloading_time;
        };
        Unit.prototype.FireInPoint = function(coordinate, bulletPool) {
            var angle = Math.atan2(coordinate.y - this.position.y, coordinate.x - this.position.x);

            this.FireInDirectionOf(angle, bulletPool);
        };

    })(engine.Unit);

    (function(Bullet){
        Bullet.prototype.Live = function(time, world) {
            this.position.x += this.speedComponents.x * time;
            this.position.y += this.speedComponents.y * time;
        };
        Bullet.prototype.FindMatches = function(players) {
            for(var k = 0; k < players.length; k++) { var player = players[k];
                for(var j = 0; j < player.team.length; j++) { var unit =  player.team[j];
                    var distance = engine.distance( this.position, unit.position );
                    if( distance < unit.size ) {
                        return unit;
                    }
                }
            }
            return null;
        };
    })(engine.Bullet);

    (function(Field){
        Field.prototype.get = function(x, y){
            if( x < 0 || x >= this.width || y < 0 || y >= this.height )
                throw new Error( "Coordinates aren't correct: " + x.toString() + " " + y.toString() );
            return this.map[y][x];
        };
    })(engine.Field);


})(engine);


