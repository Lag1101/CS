/**
 * Created by vasiliy.lomanov on 30.09.13.
 */

var stats = {};

(function(stats){

    var relativeSpeed = 0.025;
    var relativeSeeRange = 2.0;

    stats.Weapons = {
        SVD: {
            rounds_per_reload: 300,
            rounds_per_shoot: 30,
            dispersion: Math.PI/180.0 * 1.0,
            range: 15.0,
            damage: 100,
            start_speed: relativeSpeed,
            ammo_capacity: 10
        },
        AK: {
            rounds_per_reload: 30,
            rounds_per_shoot: 2,
            dispersion: Math.PI/180.0 * 15.0,
            range: 5.0,
            damage: 50,
            start_speed: relativeSpeed,
            ammo_capacity: 30
        },
        PM: {
            rounds_per_reload: 30,
            rounds_per_shoot: 10,
            dispersion: Math.PI/180.0 * 10.0,
            range: 3.0,
            damage: 20,
            start_speed: relativeSpeed,
            ammo_capacity: 8
        }
    };

    stats.Units = {
        keys: ['sniper', 'engineer', 'soldier'],
        sniper: {
            symbol: 'rgb(0,0,255)',
            max_health: 100,
            weapon: stats.Weapons.SVD,
            see_range: 7.0*relativeSeeRange,
            speed: relativeSpeed / 2,
            size: 0.5
        },
        engineer: {
            symbol: 'rgb(0,255,0)',
            max_health: 50,
            weapon: stats.Weapons.PM,
            see_range: 5.0*relativeSeeRange,
            speed: relativeSpeed / 2,
            size: 0.5
        },
        soldier: {
            symbol: 'rgb(255,0,0)',
            max_health: 150,
            weapon: stats.Weapons.AK,
            see_range: 5.0*relativeSeeRange,
            speed: relativeSpeed / 2,
            size: 0.5
        }
    };

    stats.Fields = {
        keys: ['forest','city','tower'],
        forest: {
            symbol: 'rgba(255,0,255,1)',
            friction: 2.0
        },
        city: {
            symbol: 'rgba(255,255,0,1)',
            friction: 0.5
        },
        tower: {
            symbol: 'rgba(0,255,255,1)',
            friction: 1.0
        }
    };
})(stats);


try{
    module.exports = stats;
    console.log("Server loaded ",__filename);
}catch(e)
{
    console.log("Client loaded ",'stats');
}