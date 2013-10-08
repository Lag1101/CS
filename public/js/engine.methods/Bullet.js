/**
 * Created by vasiliy.lomanov on 08.10.13.
 */

var engine = (engine || (engine = require('./../engine')) );

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

try{
    module.exports = engine;
    console.log("Server loaded %s",__filename);
}catch(e)
{
    console.log("Client loaded %s",__filename);
}