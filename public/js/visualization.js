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
        canvas_control.font = "italic 9pt Arial";
        canvas_control.fillText(text, x, y);
    }

    visualization.ShowField = function(canvas_control, field, ceil_size, min, max) {
        min = min || {x:0,y:0};
        max = max || {x:field.width,y:field.height};
        for (var y = min.y; y < max.y; y++)
            for (var x = min.x; x < max.x; x++) {
                DrawRect(canvas_control, x * ceil_size, y * ceil_size, ceil_size, ceil_size, field.map[y][x].symbol);
            }
    };

    function DrawUnit(canvas_control, unit, ceil_size) {
        var unit_x = unit.position.x * ceil_size, unit_y = unit.position.y * ceil_size;
        var size = unit.stats.size * ceil_size;
        DrawRound(canvas_control, unit_x, unit_y, size/2, engine.IsUnitAlive(unit) ? unit.stats.symbol : 'rgb(128,128,128)');
        DrawCircle(canvas_control, unit_x, unit_y, size/2, 2);
        DrawText(canvas_control, unit.health, unit_x, unit_y+size*2);
        DrawText(canvas_control, unit.weapon.ammo, unit_x, unit_y+size*3);
    }
    function DrawBullet(canvas_control, bullet, ceil_size) {
        var unit_x = bullet.position.current.x * ceil_size, unit_y = bullet.position.current.y * ceil_size;
        var size = bullet.size * ceil_size;

        canvas_control.strokeStyle = 'rgba(200,200,200,0.5)';
        canvas_control.beginPath();
        canvas_control.moveTo(bullet.position.last.x*ceil_size, bullet.position.last.y*ceil_size );
        canvas_control.lineTo(unit_x, unit_y );
        canvas_control.stroke();

        DrawRound(canvas_control, unit_x, unit_y, size/2, "rgb(255,0,0)");
        DrawCircle(canvas_control, unit_x, unit_y, size/2, 2);
    }

    visualization.MarkUnit = function(canvas_control, unit, ceil_size) {
        var unit_x = unit.position.x * ceil_size, unit_y = unit.position.y * ceil_size;
        var size = unit.stats.size * ceil_size;
        DrawCircle(canvas_control, unit_x, unit_y, size, 2, 'rgb(255,0,0)');
    };

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
                var max_visible = 0.3;
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
