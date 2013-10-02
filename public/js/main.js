/**
 * Created with JetBrains WebStorm.
 * User: vasiliy.lomanov
 * Date: 11.09.13
 * Time: 11:59
 * To change this template use File | Settings | File Templates.
 */


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
            setTimeout(function(){subscribe(arg);}, 30);
    };
    xhr.onerror = function(err) {
        console.error(err);
        setTimeout(function(){subscribe(arg);}, 500);
    };

    xhr.send();
}

function OnFieldReady(field) {
    var map_canvas = document.getElementById('map');
    var fog_canvas = document.getElementById('fog');
    var map_canvas_control = map_canvas.getContext('2d');
    var fog_canvas_control = fog_canvas.getContext('2d');

    var currentUnitIndex = 0;

    var situation = new engine.World();

    var ceil_size = map_canvas.width / field.width;
    //listeners
    {
        fog_canvas.addEventListener('click', function(event){
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

    subscribe({
        callback: function(data){
            situation.team = data;
        },
        url: '/team?do=update',
        isOnce: false
    });
    subscribe({
        callback: function(data){
            situation.visible = data;
        },
        url: '/team?do=visible',
        isOnce: false
    });


    map_canvas_control.clearRect(0, 0, map_canvas.width, map_canvas.height);
    visualization.ShowField(map_canvas_control, field, ceil_size);

    setInterval( function(){
        fog_canvas_control.clearRect(0,0,fog_canvas.width, fog_canvas.height);
        if( situation )
        {
            visualization.DrawFogOfTheWar(fog_canvas_control, field, situation.team, ceil_size);
            visualization.DrawTeam(fog_canvas_control, situation.team, ceil_size);
            visualization.DrawTeam(fog_canvas_control, situation.visible.enemies, ceil_size);
            visualization.MarkUnit(fog_canvas_control, situation.team[currentUnitIndex], ceil_size);

            visualization.DrawBullets(fog_canvas_control, situation.visible.bullets, ceil_size);
        }
    }, 1 );
}

function main() {

    subscribe({
        callback: function(data){
            OnFieldReady(data);
        },
        url: '/create_world',
        isOnce: true
    });
}
