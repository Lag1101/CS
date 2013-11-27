/**
 * Created by vasiliy.lomanov on 08.10.13.
 */
var engine = (engine || (engine = require('./../engine')) );
var auxiliary = (auxiliary || (auxiliary = require('./../auxiliary')) );

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

try{
    module.exports = engine;
    console.log("Server loaded ",__filename);
}catch(e)
{
    console.log("Client loaded ","Weapon");
}