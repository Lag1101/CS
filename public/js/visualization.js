/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:38
 * To change this template use File | Settings | File Templates.
 */

function Visualization(ctrl, width, height, ceilSize) {
    this.ctrl = ctrl;
    this.width = width;
    this.height = height;
    this.ceilSize = ceilSize;
}
Visualization.prototype.DrawRect = function(x, y, width, height, color){
    this.ctrl.fillStyle = color || '#000000';
    this.ctrl.fillRect(x, y, width, height);
};

Visualization.prototype.DrawCircle = function(x, y, r, width, color) {
    if (typeof width === "undefined") { width = 3; }
    if (typeof color === "undefined") { color = '#000000'; }
    this.ctrl.beginPath();
    this.ctrl.arc(x, y, r, 0, 2 * Math.PI, false);
    this.ctrl.lineWidth = width;
    this.ctrl.strokeStyle = color;
    this.ctrl.stroke();
};
Visualization.prototype.DrawRound = function( x, y, r, color) {
    if (typeof color === "undefined") { color = '#000000'; }
    this.ctrl.beginPath();
    this.ctrl.arc(x, y, r, 0, 2 * Math.PI, false);
    this.ctrl.fillStyle = color;
    this.ctrl.fill();
};
Visualization.prototype.DrawText = function( text, x, y, color) {
    if (typeof color === "undefined") { color = '#000000'; }
    this.ctrl.fillStyle = color;
    this.ctrl.font = "italic 9pt Arial";
    this.ctrl.fillText(text, x, y);
};

Visualization.prototype.ShowField = function( field, min, max) {
    min = min || {x:0,y:0};
    max = max || {x:field.width,y:field.height};
    for (var y = min.y; y < max.y; y++)
        for (var x = min.x; x < max.x; x++) {
            this.DrawRect(x * this.ceilSize, y * this.ceilSize, this.ceilSize, this.ceilSize, field.map[y][x].symbol);
        }
};

Visualization.prototype.DrawUnit = function( unit ) {
    var unit_x = unit.position.x * this.ceilSize, unit_y = unit.position.y * this.ceilSize;
    var size = unit.stats.size * this.ceilSize;
    this.DrawRound( unit_x, unit_y, size/2, engine.IsUnitAlive(unit) ? unit.stats.symbol : 'rgb(128,128,128)');
    this.DrawCircle( unit_x, unit_y, size/2, 2);
    this.DrawText( unit.health, unit_x, unit_y+size*2);
    this.DrawText( unit.weapon.ammo, unit_x, unit_y+size*3);
};
Visualization.prototype.DrawBullet = function( bullet) {
    var unit_x = bullet.position.current.x * this.ceilSize, unit_y = bullet.position.current.y * this.ceilSize;
    var size = bullet.size * this.ceilSize;

    this.ctrl.strokeStyle = 'rgba(200,200,200,0.5)';
    this.ctrl.beginPath();
    this.ctrl.moveTo(bullet.position.last.x*this.ceilSize, bullet.position.last.y*this.ceilSize );
    this.ctrl.lineTo(unit_x, unit_y );
    this.ctrl.stroke();

    this.DrawRound( unit_x, unit_y, size/2, "rgb(255,0,0)");
    this.DrawCircle( unit_x, unit_y, size/2, 2);
};

Visualization.prototype.MarkUnit = function( unit) {
    var unit_x = unit.position.x * this.ceilSize, unit_y = unit.position.y * this.ceilSize;
    var size = unit.stats.size * this.ceilSize;
    this.DrawCircle( unit_x, unit_y, size, 2, 'rgb(255,0,0)');
};

Visualization.prototype.DrawTeam = function( team ) {
    var v = this;
    team.forEach(function( unit ){
        v.DrawUnit( unit );
    });
};
Visualization.prototype.DrawBullets = function( bullets ) {
    var v = this;
    bullets.forEach(function( unit ){
        v.DrawBullet( unit );
    });
};

Visualization.prototype.DrawFogOfTheWar = function( field, team ) {
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
            this.DrawRect( x * this.ceilSize, y * this.ceilSize, this.ceilSize, this.ceilSize, transparent(1.0-max_visible));
        }
    }
};

Visualization.prototype.Clear = function() {
    this.ctrl.clearRect(0, 0, this.width, this.height);
};

function VisualizationPIXI(width, height, ceilSize)
{
    var v = this;
    this.teamToShow = [];
    this.width = width;
    this.height = height;
    this.ceilSize = ceilSize;

// create an new instance of a pixi stage
    this.stage = new PIXI.Stage(0x000000, true);

// create a renderer instance
    this.renderer = PIXI.autoDetectRenderer(this.width, this.height, null);

    document.body.appendChild(this.renderer.view);
    this.renderer.view.style.position = "absolute";
    this.renderer.view.style.top = "0px";
    this.renderer.view.style.left = "0px";

    this.texture = PIXI.Texture.fromImage("unit.png");

    function animate() {
        requestAnimFrame( animate );

        // just for fun, lets rotate mr rabbit a little
        //stage.interactionManager.update();
        // render the stage
        v.renderer.render(v.stage);
    }
    setTimeout(function(){requestAnimFrame(animate);}, 10);
}
VisualizationPIXI.prototype.Update = function(team)
{
    var v = this;
    if( this.teamToShow.length == 0 ) {

        for( var i = 0; i < team.length; i++ ) {
            var bunny = new PIXI.Sprite(v.texture);
            bunny.anchor.x = 0.5;
            bunny.anchor.y = 0.5;
            v.teamToShow.push(bunny);
            v.stage.addChild(bunny);
        }
    }

    for( var i = 0; i < team.length; i++ ) {
        var unit = team[i];
        var bunny = v.teamToShow[i];

        bunny.position.x = unit.position.x* v.ceilSize;
        bunny.position.y = unit.position.y* v.ceilSize;
    }
}