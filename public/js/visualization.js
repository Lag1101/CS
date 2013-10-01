/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:38
 * To change this template use File | Settings | File Templates.
 */

var visualization;
(function (visualization) {
    function DrawRect(canvas_control, x, y, width, height, color) {
        if (typeof color === "undefined") { color = '#000000'; }
        canvas_control.fillStyle = color;
        canvas_control.fillRect(x, y, width, height);
    }
    function DrawCircle(canvas_control, x, y, r, width, color) {
        if (typeof width === "undefined") { width = 3; }
        if (typeof color === "undefined") { color = '#000000'; }
        canvas_control.beginPath();
        canvas_control.arc(x, y, r, 0, 2 * Math.PI, false);
        canvas_control.lineWidth = width;
        canvas_control.strokeStyle = color;
        canvas_control.stroke();
    }
    function DrawRound(canvas_control, x, y, r, color) {
        if (typeof color === "undefined") { color = '#000000'; }
        canvas_control.beginPath();
        canvas_control.arc(x, y, r, 0, 2 * Math.PI, false);
        canvas_control.fillStyle = color;
        canvas_control.fill();
    }
    function DrawText(canvas_control, text, x, y, color) {
        if (typeof color === "undefined") { color = '#000000'; }
        canvas_control.fillStyle = color;
        canvas_control.font = "italic 7pt Arial";
        canvas_control.fillText(text, x, y);
    }

    visualization.ShowField = function(canvas_control, field, ceil_size) {
        for (var y = 0; y < field.height; y++)
            for (var x = 0; x < field.width; x++) {
                DrawRect(canvas_control, x * ceil_size, y * ceil_size, ceil_size, ceil_size, field.map[y][x].symbol);
            }
    };

    function DrawUnit(canvas_control, unit, ceil_size) {
        var unit_x = unit.position.x * ceil_size, unit_y = unit.position.y * ceil_size;
        DrawRound(canvas_control, unit_x, unit_y, 10, engine.IsUnitAlive(unit) ? unit.symbol : 'rgb(128,128,128)');
        DrawCircle(canvas_control, unit_x, unit_y, 10, 2);
        DrawText(canvas_control, unit.health.value, unit_x, unit_y);
        DrawText(canvas_control, unit.weapon.ammo.value.toString(), unit_x, unit_y+10);
    }
    function DrawBullet(canvas_control, unit, ceil_size) {
        var unit_x = unit.position.x * ceil_size, unit_y = unit.position.y * ceil_size;
        DrawRound(canvas_control, unit_x, unit_y, 3, "rgb(255,0,0)");
        DrawCircle(canvas_control, unit_x, unit_y, 3, 2);
    }
    visualization.DrawTeam = function(canvas_control, team, ceil_size) {
        team.forEach(function( unit ){
            DrawUnit(canvas_control, unit, ceil_size);
        });
    };
    visualization.DrawBullets = function(canvas_control, bullets, ceil_size) {
        bullets.forEach(function( unit ){
            DrawBullet(canvas_control, unit, ceil_size);
        });
    };

    visualization.DrawFogOfTheWar = function(canvas_control, field, team, ceil_size) {
        var transparent = function(a) { return "rgba(0,0,0,"+ a.toString() + ")"; };

        var position = new engine.Coordinate(0,0);
        for (var y = 0; y < field.height; y++) {
            position.y = y + 0.5;
            for (var x = 0; x < field.width; x++) {
                position.x = x + 0.5;
                var max_visible = 0.0;
                team.forEach(function(unit) {
                    if( engine.IsUnitAlive(unit) )
                    {
                        var visible = engine.HowUnitCanSeeThis(unit, position);
                        if( visible > max_visible ) max_visible = visible;
                    }

                });
                //DrawText(canvas_control, max_visible,  x * ceil_size, y * ceil_size);
                //if ( max_visible > 0 )
                DrawRect(canvas_control, x * ceil_size, y * ceil_size, ceil_size, ceil_size, transparent(1.0-max_visible));
            }
        }
    };


})(visualization || (visualization = {}));
