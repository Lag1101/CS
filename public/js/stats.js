/**
 * Created by vasiliy.lomanov on 30.09.13.
 */

var stats = {};

(function(stats){
    stats.Weapons = {
        dragunov: {
            reloading_time: 30,
            dispersion: Math.PI/180.0 * 1.0,
            range: 15.0,
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

    stats.Units = {
        keys: ['sniper', 'engineer', 'soldier'],
        sniper: {
            symbol: 'rgba(0,0,255,1.0)',
            max_health: 100,
            weapon: stats.Weapons.dragunov,
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