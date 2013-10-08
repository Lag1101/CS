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
            setTimeout(function(){subscribe(arg);}, 50);
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

    var ceil_size = map_canvas.width / field.width;

    var UpLayer = new Visualization(fog_canvas.getContext('2d'), fog_canvas.width, fog_canvas.height, ceil_size);
    var DownLayer = new Visualization(map_canvas.getContext('2d'), map_canvas.width, map_canvas.height, ceil_size);

    var currentUnitIndex = 0;

    var situation = new engine.World();


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

    DownLayer.Clear();
    DownLayer.ShowField( field );

    setInterval( function(){
        UpLayer.Clear();
        if( situation )
        {
            UpLayer.DrawFogOfTheWar( field, situation.team );
            UpLayer.DrawTeam( situation.team );
            UpLayer.DrawTeam( situation.visible.enemies );
            UpLayer.MarkUnit( situation.team[currentUnitIndex] );

            UpLayer.DrawBullets( situation.visible.bullets );
        }
    }, 45 );
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
