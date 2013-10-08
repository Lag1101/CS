/**
 * Created by vasiliy.lomanov on 08.10.13.
 */

var engine = (engine || (engine = require('./../engine')) );
var auxiliary = (auxiliary || (auxiliary = require('./../auxiliary')) );

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

try{
    module.exports = engine;
    console.log("Server loaded %s",__filename);
}catch(e)
{
    console.log("Client loaded %s",__filename);
}