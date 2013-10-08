/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 23.09.13
 * Time: 22:20
 * To change this template use File | Settings | File Templates.
 */

var engine = (engine || (engine = require('./../engine')) );
require('./Game');
try{
    module.exports = engine;
    console.log("Server loaded %s",__filename);
}catch(e)
{
    console.log("Client loaded %s",__filename);
}