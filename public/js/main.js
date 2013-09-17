/**
* Created with JetBrains WebStorm.
* User: vasiliy.lomanov
* Date: 11.09.13
* Time: 11:59
* To change this template use File | Settings | File Templates.
*/
/// <reference path="visualization.ts"/>
function main() {
    var map_canvas = document.getElementById('map');
    var map_canvas_control = map_canvas.getContext('2d');

    var ceil_size = 16;
    var field = new engine.Field(map_canvas.width / ceil_size, map_canvas.height / ceil_size);

    var team = engine.CreateTeam(5);
    var currentUnit = team[0];

    //field.MakeFogOfTheWar(team);
    setInterval(function () {
        map_canvas_control.clearRect(0, 0, map_canvas.width, map_canvas.height);

        visualization.ShowField(map_canvas_control, field, ceil_size);
        visualization.ShowTeam(map_canvas_control, team, ceil_size);
    }, 25);

    map_canvas.addEventListener('click', function (event) {
        currentUnit.position.x = (event.x - this.offsetLeft) / ceil_size;
        currentUnit.position.y = (event.y - this.offsetTop) / ceil_size;
        //field.MakeFogOfTheWar(team);
    });
    document.addEventListener('keypress', function (event) {
        if (event.keyCode >= 49 && event.keyCode <= 56)
            currentUnit = team[event.keyCode - 49];
    });
}
//# sourceMappingURL=main.js.map
