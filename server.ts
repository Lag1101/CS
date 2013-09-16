/**
 * Created with JetBrains WebStorm.
 * User: vasiliy.lomanov
 * Date: 11.09.13
 * Time: 16:56
 * To change this template use File | Settings | File Templates.
 */

var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require('path');

http.createServer( function(req, res){

    var parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl.pathname);

    var ROOT = 'site';

    sendFileSafe(parsedUrl.pathname, res, ROOT)

}).listen( 5000, "127.0.0.1") ;

setInterval(function(){
    console.info(process.memoryUsage());
}, 5000);


function sendFileSafe(filePath, res, root) {
    try{
        filePath = decodeURIComponent(filePath);
    }catch(e){
        res.statusCode = 400;
        res.end('Bad Request');
    }
    if( ~filePath.indexOf('\0') ) {
        res.statusCode = 400;
        res.end('Bad Request');
    }
    filePath = path.normalize(path.join(root, filePath));

    if( filePath.indexOf(root) != 0 ) {
        res.statusCode = 404;
        res.end('File not found');
    }

    fs.stat(filePath, function(err, stats) {
        if( err || !stats.isFile() ) {
            res.statusCode = 404;
            res.end('File not found');
            return;
        }

        sendFile(filePath, res);
    });
}

function sendFile(filePath, res) {

    /*var file = new fs.ReadStream(filePath);

    file.on('readable', write);

    function write() {
        var content = file.read();

        if( content && !res.write(content) ) {
            file.removeListener('readable', write);

            res.once('drain', function() {
                file.on('readable', write);
                write();
            })
        }
    }
    file.on('end', function() {
        res.end();
    });
    file.on('err', function(err) {
        console.error(err.message);
        res.statusCode = 500;
        res.end('Server Error');
    }); */

    var file = fs.createReadStream(filePath);

    file.pipe(res);

    file.on('error', function(err) {
        res.statusCode = 500;
        res.end('Server Error');
        console.error(err);
    });
    res.on('close', function() {
        file.destroy(); // in case of unexpected connection closing
    });
}