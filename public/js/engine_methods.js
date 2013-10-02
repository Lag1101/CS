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
         if( unit.weapon.Ready() )
         {
             if( world.visible.enemies.length > 0 )
             {
                 var firstEnemy = world.visible.enemies[0];
                 var distance = engine.distance(unit.position, firstEnemy.position);
                 if( unit.weapon.stats.range >= distance)
                     unit.FireInPoint(firstEnemy.position, world.bulletPool);
             }

         } else if ( unit.weapon.Empty() ) {
             unit.weapon.Reload();
         }
     });
}

(function (engine) {
    (function(Game){
        Game.prototype.Live = function() {
            var g = this;

            var bulletPool = [];
            async.each( g.players,
                function( player ){
                    Live(new engine.World(
                        player.team,
                        g.GetVisibleUnitsForPlayer(player),
                        g.GetVisibleBulletsForPlayer(player),
                        g.field,
                        bulletPool
                    ));
                });
            g.bullets = g.bullets.concat(bulletPool);

            for(var i = 0; i < g.bullets.length; )
            {
                var bullet = g.bullets[i];
                bullet.Live( g.timeStep, g.field );
                if( !auxiliary.isInBounds(bullet.position.current.x, 0, g.field.width) ||
                    !auxiliary.isInBounds(bullet.position.current.y, 0, g.field.height) )
                    g.bullets.splice(i,1);
                else
                    i++;
            }
            for(var i = 0; i < g.bullets.length; ) { var bullet = g.bullets[i];
                var victim = bullet.FindMatches(g.players);
                if( victim != null ) {
                    victim.health -= bullet.damage;
                    if( victim.health < 0 )
                        victim.health = 0;
                    g.bullets.splice(i,1);
                } else {
                    i++;
                }
            }

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
        };
        Game.prototype.Start = function() {
            var g = this;
            this.timeIntervalDescriptor = setInterval( function(){g.Live();}, g.timeStep );
        };
        Game.prototype.Stop = function() {
            if( this.timeIntervalDescriptor ) clearInterval( this.timeIntervalDescriptor );
        };
        Game.prototype.AddPlayer = function(player) {
            this.players.push(player);
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

        Game.prototype.GetVisibleBulletsForPlayer = function(player) {
            var visibleBullets = [];
            this.bullets.forEach(function(bullet) {
                for( var i = 0; i < player.team.length; i++ ) {var unit = player.team[i];
                    if( !engine.IsUnitAlive(unit) ) continue;

                    if( engine.distance( unit.position, bullet.position.current ) <= unit.stats.see_range )
                        visibleBullets.push( bullet );
                }
            });
            return visibleBullets;
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
            this.weapon.Live();
        };
        Unit.prototype.Move = function( time, world ) {
            if( this.destination == engine.NullCoordinate ) return;

            var total_distance = engine.distance( this.position, this.destination );

            if( this.IsNear( total_distance ) ) {
                this.destination = engine.NullCoordinate;
                return;
            }

            var current_ceil = world.get( Math.floor( this.position.x), Math.floor( this.position.y ) );
            var speed = this.stats.speed / current_ceil.friction;
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
            if( !this.weapon.Ready ) {
                console.info( "Weapon isn't ready" );
                return;
            } else if( this.weapon.Empty() ) {
                console.info( "Need to reload weapon" );
                return;
            }

            this.weapon.Shoot(this, direction, bulletPool);
        };
        Unit.prototype.FireInPoint = function(coordinate, bulletPool) {
            var angle = Math.atan2(coordinate.y - this.position.y, coordinate.x - this.position.x);

            this.FireInDirectionOf(angle, bulletPool);
        };

    })(engine.Unit);

    (function(Bullet){
        Bullet.prototype.Live = function(time, world) {
            this.position.last.x = this.position.current.x;
            this.position.last.y = this.position.current.y;
            this.position.current.x += this.speedComponents.x * time;
            this.position.current.y += this.speedComponents.y * time;
        };
        Bullet.prototype.FindMatches = function(players) {
            var x0 = this.position.last.x;
            var y0 = this.position.last.y;
            var x1 = this.position.current.x;
            var y1 = this.position.current.y;

            var diff = {
                x: x1 - x0,
                y: y1 - y0
            };
            var s2 = engine.distance2(this.position.current, this.position.last);
            if( s2 == 0 )
                return null;

            for(var k = 0; k < players.length; k++) { var player = players[k];
                for(var j = 0; j < player.team.length; j++) { var unit =  player.team[j];
                    var size2 = Math.pow(unit.stats.size/2 + this.size/2 , 2);

                    var distance2_to_line = Math.pow(
                            -diff.y * unit.position.x +
                            diff.x * unit.position.y +
                            x0*y1-x1*y0
                         , 2)/ s2;

                    if( distance2_to_line < size2 ) {
                        var distance2_to_current = engine.distance2( this.position.current, unit.position );
                        if( distance2_to_current < size2 ) {
                            //console.log('current')
                            return unit;
                        }
                        var distance2_to_last = engine.distance2( this.position.last, unit.position );
                        if ( distance2_to_last < size2 ) {
                            //console.log('last')
                            return unit;
                        }

                        if( s2 + distance2_to_current > distance2_to_last &&
                            s2 + distance2_to_last > distance2_to_current) {
                            //console.log('border')
                            return unit;
                        }
                    }


                }
            }
            return null;
        };
    })(engine.Bullet);

    (function(Weapon){
        Weapon.prototype.Live = function() {
            if( this.rounds_to_ready > 0 )
                this.rounds_to_ready --;
            if( this.rounds_to_end_reload > 0 ) {
                this.rounds_to_end_reload --;
                if( this.rounds_to_end_reload == 0 ) {
                    this.ammo = this.stats.ammo_capacity;
                }
            }
        };
        /**
         * @return {boolean}
         */
        Weapon.prototype.Empty = function() {
            return this.ammo <= 0;
        };
        /**
         * @return {boolean}
         */
        Weapon.prototype.Ready = function() {
            return  this.rounds_to_ready == 0 &&
                    this.rounds_to_end_reload == 0 &&
                    !this.Empty();
        };
        Weapon.prototype.Reload = function() {
            if( this.rounds_to_end_reload > 0 ) {
                //already reloading
            } else {
                this.rounds_to_end_reload = this.stats.rounds_per_reload;
            }
        };
        Weapon.prototype.Shoot = function(owner, direction, bulletPool) {
            if( this.Ready() && !this.Empty()) {

                var position = auxiliary.clone(owner.position);
                position.x += (owner.stats.size) * Math.cos( direction );
                position.y += (owner.stats.size) * Math.sin( direction );
                var bullet = new engine.Bullet(
                    position,
                    direction + this.stats.dispersion * ( Math.random() - 0.5 ),
                    this.stats.damage,
                    this.stats.start_speed
                );
                bulletPool.push(bullet);

                this.ammo --;
                this.rounds_to_ready = this.stats.rounds_per_shoot;
            }
        }
    })(engine.Weapon);

    (function(Field){
        Field.prototype.get = function(x, y){
            if( x < 0 || x >= this.width || y < 0 || y >= this.height )
                throw new Error( "Coordinates aren't correct: " + x.toString() + " " + y.toString() );
            return this.map[y][x];
        };
    })(engine.Field);


})(engine);


try{
    module.exports = engine;
    console.log("It's server, Brother");
}catch(e)
{
    console.log("It's browser, Brother");
}