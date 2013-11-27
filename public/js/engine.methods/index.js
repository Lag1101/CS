/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 23.09.13
 * Time: 22:20
 * To change this template use File | Settings | File Templates.
 */

var engine = (engine || (engine = require('./../engine')) );
try{
    require('./Game');
}catch(e){}
try{
    module.exports = engine;
    console.log("Server loaded ",__filename);
}catch(e)
{
    console.log("Client loaded ",'index');
}