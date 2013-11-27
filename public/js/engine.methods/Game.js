/**
 * Created by vasiliy.lomanov on 08.10.13.
 */
var engine = (engine || (engine = require('./../engine')) );
var auxiliary = (auxiliary || (auxiliary = require('./../auxiliary')) );

try{
    require('./Unit');
    require('./Bullet');
    require('./Weapon');
    require('./Field');
}catch(e){}

(function(Game){

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

    Game.prototype.ProcessPlayers = function() {
        var g = this;
        var bulletPool = [];
        g.players.forEach(function( player ){
                Live(new engine.World(
                    player.team,
                    g.GetVisibleUnitsForPlayer(player),
                    g.GetVisibleBulletsForPlayer(player),
                    g.field,
                    bulletPool
                ));
            });
        g.bullets = g.bullets.concat(bulletPool);
    };
    Game.prototype.MoveBullets = function() {
        var g = this;
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
    };
    Game.prototype.CheckHits = function() {
        var g = this;
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
    };
    Game.prototype.MoveUnits = function() {
        var g = this;
        g.players.forEach(function(player) {
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
    Game.prototype.Live = function() {
        this.ProcessPlayers();
        this.MoveBullets();
        this.CheckHits();
        this.MoveUnits();
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

try{
    module.exports = engine;
    console.log("Server loaded ",__filename);
}catch(e)
{
    console.log("Client loaded ",'Game');
}