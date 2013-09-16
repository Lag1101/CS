/**
 * Created with JetBrains WebStorm.
 * User: vasiliy.lomanov
 * Date: 11.09.13
 * Time: 16:56
 * To change this template use File | Settings | File Templates.
 */

var http = require("http");
var fs = require("fs");
var url = require("url")

http.createServer( function(req, res){

    var parsedUrl = url.parse(req.url, true);

    console.log(parsedUrl.pathname);

    if( parsedUrl.pathname )
    {
        fs.readFile(__dirname + parsedUrl.pathname, function(err, data){
            if( err )
            {
                console.error(err.message);
                res.end(404);
            }
            else {
                res.end(data);
            }
        });
    }
}).listen(5000, "127.0.0.1") ;

setInterval(function(){
    console.info(process.memoryUsage());
}, 1000);
