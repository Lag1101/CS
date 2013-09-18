/**
 * Created with JetBrains WebStorm.
 * User: vasiliy.lomanov
 * Date: 11.09.13
 * Time: 11:59
 * To change this template use File | Settings | File Templates.
 */

var situation = new engine.Situation();

function submit() {
    var xhr = new XMLHttpRequest();
    console.log("sended %s", JSON.stringify(situation.team))

    xhr.open("POST", '/JDI', true);

    xhr.send( JSON.stringify(situation.team) );
}

function subscribe() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", '/WASUP', true);

    xhr.onload = function() {
        situation = JSON.parse(this.responseText);
        setTimeout(subscribe, 500);
    };
    xhr.onerror = function(err) {
        console.error(err);
        setTimeout(subscribe, 500);
    };

    xhr.send();
}
function main() {
    var map_canvas = document.getElementById('map');
    var map_canvas_control = map_canvas.getContext('2d');

    var ceil_size = 16;
    var field = new engine.Field(map_canvas.width / ceil_size, map_canvas.height / ceil_size);

    var team = situation.team;
    var currentUnit = null;

    //listeners
    {
        map_canvas.addEventListener('click', function(event){
            if( currentUnit )
            {
                currentUnit.position.x = (event.x-this.offsetLeft) / ceil_size;
                currentUnit.position.y = (event.y-this.offsetTop) / ceil_size;

            }
            submit();
        });
        document.addEventListener('keypress', function(event){
            if( event.keyCode >=49 && event.keyCode <= 56 )
                currentUnit = team[event.keyCode-49];
        });
    }

    //JDI
    {
        subscribe();
        setInterval( function(){
            map_canvas_control.clearRect(0,0,map_canvas.width,map_canvas.height);

            visualization.ShowField(map_canvas_control, field, ceil_size);
            visualization.DrawTeam(map_canvas_control, situation.team, ceil_size);
        }, 100 );
    }
}
