/**
 * Created with JetBrains WebStorm.
 * User: vasiliy.lomanov
 * Date: 11.09.13
 * Time: 16:56
 * To change this template use File | Settings | File Templates.
 */

var http = require("http");
var fs = require("fs");

var server = new http.Server();


server.listen(5000, "127.0.0.1");
server.on('request',  function(req, res){

    fs.readFile('./'+req.url, function(err, data){
        if( err )
        {
            console.error(err.message);
            res.statusCode = 404;
            res.end();
        }
        else {
            var file = data.toString('utf-8');
            console.log('Requested ' + req.url);
            res.end(file);
        }
    });
}) ;

