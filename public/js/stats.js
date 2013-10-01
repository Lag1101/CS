/**
 * Created by vasiliy.lomanov on 30.09.13.
 */

var stats = {};

(function(stats){
    stats.Weapon = function(weaponStats) {
        this.rounds_per_reload = weaponStats.rounds_per_reload;
        this.rounds_per_shoot = weaponStats.rounds_per_shoot;
        this.dispersion = weaponStats.dispersion;
        this.range = weaponStats.range;
        this.damage = weaponStats.damage;
        this.start_speed = weaponStats.start_speed;
        this.ammo_capacity = weaponStats.ammo_capacity;
    };
    stats.Weapons = {
        SVD: new stats.Weapon({
            rounds_per_reload: 300,
            rounds_per_shoot: 30,
            dispersion: Math.PI/180.0 * 1.0,
            range: 15.0,
            damage: 100,
            start_speed:0.06,
            ammo_capacity: 10
        }),
        AK: new stats.Weapon({
            rounds_per_reload: 30,
            rounds_per_shoot: 2,
            dispersion: Math.PI/180.0 * 15.0,
            range: 5.0,
            damage: 50,
            start_speed:0.03,
            ammo_capacity: 30
        }),
        PM: new stats.Weapon({
            rounds_per_reload: 30,
            rounds_per_shoot: 10,
            dispersion: Math.PI/180.0 * 10.0,
            range: 3.0,
            damage: 20,
            start_speed:0.015,
            ammo_capacity: 8
        })
    };

    stats.Units = {
        keys: ['sniper', 'engineer', 'soldier'],
        sniper: {
            symbol: 'rgba(0,0,255,1.0)',
            max_health: 100,
            weapon: stats.Weapons.SVD,
            see_range: 7.0,
            speed: 0.0025,
            size: 0.5
        },
        engineer: {
            symbol: 'rgba(0,255,0,1.0)',
            max_health: 50,
            weapon: stats.Weapons.PM,
            see_range: 5.0,
            speed: 0.005,
            size: 0.5
        },
        soldier: {
            symbol: 'rgba(255,0,0,1.0)',
            max_health: 150,
            weapon: stats.Weapons.AK,
            see_range: 5.0,
            speed: 0.01,
            size: 0.5
        }
    };

    stats.Fields = {
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
})(stats);


try{
    module.exports = stats;
    console.log("It's server, Brother");
}catch(e)
{
    console.log("It's browser, Brother");
}