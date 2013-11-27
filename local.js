/**
 * Created by vasiliy.lomanov on 26.11.13.
 */


var game = new engine.Game(32,32,30);
var player = new engine.Player(engine.CreateTeam(5, 0, 0), game);
var defaultEnemy = new engine.Player(engine.CreateTeam(1, 8, 8), game);
game.AddPlayer(player);
game.AddPlayer(defaultEnemy);
//game.bullets.push(new engine.Bullet(new engine.Coordinate(0,1), 0));

game.Start();

var map_canvas = document.getElementById('map');
var fog_canvas = document.getElementById('fog');

var ceil_size = map_canvas.width / game.field.width;

var DownLayer = new Visualization(map_canvas.getContext('2d'), map_canvas.width, map_canvas.height, ceil_size);
// var vPIXI = new VisualizationPIXI(fog_canvas.width, fog_canvas.height, ceil_size, 'public/unit.png');
var UpLayer = new Visualization(fog_canvas.getContext('2d'), fog_canvas.width, fog_canvas.height, ceil_size);

var currentUnitIndex = 0;

//listeners
{
    fog_canvas.addEventListener('click', function(event){
        player.team[currentUnitIndex].SetDestination(
            new engine.Coordinate(
                (event.x-this.offsetLeft) / ceil_size,
                (event.y-this.offsetTop) / ceil_size
            )
        );
        console.log(currentUnitIndex, 'went to', (event.x-this.offsetLeft) / ceil_size,
            (event.y-this.offsetTop) / ceil_size);
    });
    document.addEventListener('keypress', function(event){
        if( event.keyCode >=49 && event.keyCode <= 56 ) {
            currentUnitIndex = event.keyCode-49;
            console.log('Choosed %d unit', currentUnitIndex);
        }
    });
}

DownLayer.Clear();
DownLayer.ShowField( game.field );

setInterval( function(){
    //vPIXI.Update(player.team);
    //vPIXI.Update(visible.enemies);
    UpLayer.Clear();

    UpLayer.DrawFogOfTheWar( game.field, player.team );
    UpLayer.DrawTeam( player.team );
    UpLayer.MarkUnit( player.team[currentUnitIndex] );

    var visible = {
        enemies: game.GetVisibleUnitsForPlayer(player),
        bullets: game.GetVisibleBulletsForPlayer(player)
    };
    UpLayer.DrawTeam( visible.enemies );
    UpLayer.DrawBullets( visible.bullets );

}, 1 );