/**
 * Created with JetBrains WebStorm.
 * User: vasiliy.lomanov
 * Date: 17.09.13
 * Time: 10:41
 * To change this template use File | Settings | File Templates.
 */

var nconf = require('nconf');
var path = require('path');

nconf
    .argv()
    .env()
    .file({ file: path.join(__dirname, 'config.json') });


module.exports = nconf;