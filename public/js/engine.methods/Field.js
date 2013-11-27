/**
 * Created by vasiliy.lomanov on 08.10.13.
 */
var engine = (engine || (engine = require('./../engine')) );

(function(Field){
    Field.prototype.get = function(x, y){
        if( x < 0 || x >= this.width || y < 0 || y >= this.height )
            throw new Error( "Coordinates aren't correct: " + x.toString() + " " + y.toString() );
        return this.map[Math.floor(y)][Math.floor(x)];
    };
})(engine.Field);

try{
    module.exports = engine;
    console.log("Server loaded ",__filename);
}catch(e)
{
    console.log("Client loaded ",'Field');
}