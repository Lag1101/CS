/**
 * Created with JetBrains WebStorm.
 * User: vasiliy.lomanov
 * Date: 24.09.13
 * Time: 11:19
 * To change this template use File | Settings | File Templates.
 */

var auxiliary = (auxiliary || (auxiliary = require('./auxiliary')) );

var Transport = {};
(function(Transport) {
    Transport.commands = {
        move: 'move'
    };
    function Action(who, what, target) {
        this.who = who;
        this.what = what;
        this.target = target;
    }

    Transport.code = function(who, what, target) {
        return /*auxiliary.LZW.encode*/( JSON.stringify( new Action(who, what, target) ) );
    };

    Transport.decode = function(message) {
        return JSON.parse( /*auxiliary.LZW.decode*/( message ) );
    };
    Transport.TeamCoordinatesToArray = function(team) {
        var array = [];
        for( var i = 0; i < team.length; i++ ) {
            array.push( {n:i, position: team[i].position} );
        }
        return array;
    };
    Transport.ArrayToTeamCoordinates = function(array, team) {
        array.forEach(function(upd){
            team[upd.n].position = upd.position;
        });
    };
})(Transport);

try{
    module.exports = Transport;
    console.log("It's server, Brother");
}catch(e)
{
    console.log("It's browser, Brother");
}



