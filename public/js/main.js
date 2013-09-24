/**
 * Created with JetBrains WebStorm.
 * User: vasiliy.lomanov
 * Date: 11.09.13
 * Time: 11:59
 * To change this template use File | Settings | File Templates.
 */

var situation = new engine.Situation();
var field = null;

function submit(message) {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", '/JDI', true);

    xhr.send( message );
}

function subscribe(arg) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", arg.url, true);

    xhr.onload = function() {
        arg.callback(JSON.parse(this.responseText));
        if( arg.isOnce === false )
            setTimeout(function(){subscribe(arg);}, 25);
    };
    xhr.onerror = function(err) {
        console.error(err);
        setTimeout(function(){subscribe(arg);}, 500);
    };

    xhr.send();
}

function main() {
    var map_canvas = document.getElementById('map');
    var map_canvas_control = map_canvas.getContext('2d');

    var currentUnitIndex = 0;

    var ceil_size = 160;
    //listeners
    {
        map_canvas.addEventListener('click', function(event){
            submit( Transport.code(currentUnitIndex,
                                    Transport.commands.move,
                                    new engine.Coordinate( (event.x-this.offsetLeft) / ceil_size,
                                                           (event.y-this.offsetTop) / ceil_size))
            );
        });
        document.addEventListener('keypress', function(event){
            if( event.keyCode >=49 && event.keyCode <= 56 ) {
                currentUnitIndex = event.keyCode-49;
                console.log('Choosed %d unit', currentUnitIndex);
            }
        });
    }

    //JDI
    {
        subscribe({
            callback: function(data){
                field = data;
            },
            url: '/create_world',
            isOnce: true
        });
        subscribe({
            callback: function(data){
                situation.team = data;
            },
            url: '/team?do=create',
            isOnce: true
        });
        subscribe({
            callback: function(data){
                Transport.ArrayToTeamCoordinates(data, situation.team);
            },
            url: '/team?do=update',
            isOnce: false
        });
        setInterval( function(){
            map_canvas_control.clearRect(0,0,map_canvas.width,map_canvas.height);

            if( field !== null ) {
                visualization.ShowField(map_canvas_control, field, ceil_size);
                if( situation )
                    visualization.DrawTeam(map_canvas_control, situation.team, ceil_size);
            }
        }, 25 );
    }
}
