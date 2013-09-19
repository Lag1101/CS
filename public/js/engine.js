/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:11
 * To change this template use File | Settings | File Templates.
 */
var auxiliary = {
    clone: function(obj){
        if(obj == null || typeof(obj) != 'object')
            return obj;
        var temp = new obj.constructor();
        for(var key in obj)
            temp[key] = this.clone(obj[key]);
        return temp;
    },
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    GetRandom: function (array){
        return array[this.getRandomInt(0,array.length-1)]
    },
    extend: function (Child, Parent) {
        var F = function() { }
        F.prototype = Parent.prototype
        Child.prototype = new F()
        Child.prototype.constructor = Child
        Child.superclass = Parent.prototype
    },
    inherit_B: function (Child, Parent)
    {
        var F = function () { };
        F.prototype = Parent.prototype;
        var f = new F();

        for (var prop in Child.prototype) f[prop] = Child.prototype[prop];
        Child.prototype = f;
        Child.prototype.super = Parent.prototype;
    }

};

var engine;
(function (engine) {
    var UnitType = {
        sniper:'sniper',
        engineer:'engineer',
        soldier:'soldier'
    };
    var GroundType = {
        forest:'forest',
        city:'city',
        tower:'tower'
    };
    engine.UnitType = UnitType;
    engine.GroundType = GroundType;

    var Properties = (function(){
         function Properties(id, symbol){
             this.id = id;
             this.symbol = symbol;
         }
         return Properties;
     })();
    var UnitProperties = (function(){
        function UnitProperties(id, symbol){
            Properties.call(this, id, symbol);
        }
        auxiliary.inherit_B(UnitProperties, Properties);
        return UnitProperties;
    })();
    engine.UnitProperties = UnitProperties;

    var CeilProperties = (function(){
        function CeilProperties(id, symbol, friction){
            Properties.call(this, id, symbol);
            this.friction = friction ? friction : 1.0;
        }
        auxiliary.inherit_B(CeilProperties, Properties);
        return CeilProperties;
    })();
    engine.CeilProperties = CeilProperties;

    engine.Fields = [
        new CeilProperties(GroundType.forest,    'rgba(255,0,255,0.5)',   2.0),
        new CeilProperties(GroundType.city,      'rgba(255,255,0,0.5)',   0.5),
        new CeilProperties(GroundType.tower,     'rgba(0,255,255,0.5)',   1.0)
    ];
    engine.Units = [
        new UnitProperties(UnitType.sniper,   'rgba(255,0,0,1.0)'),
        new UnitProperties(UnitType.engineer, 'rgba(0,0,255,1.0)'),
        new UnitProperties(UnitType.soldier,  'rgba(0,255,0,1.0)')
    ];

    engine.Ceil = (function(){
        function Ceil( type ){
            this.type = type;
        }
        return Ceil;
    })();

    engine.Field = (function(){
        function Field( width, height ){
            this.width = width;
            this.height = height;
            this.map = [];

            for( var y = 0; y < height; y++ )
            {
                var line = [];
                for( var x = 0; x < width; x++ ) line.push( new engine.Ceil( auxiliary.clone(auxiliary.GetRandom(engine.Fields)) ));
                this.map.push(line);
            }
        }
        Field.prototype.get = function(x, y){
            if( x < 0 || x >= this.width || y < 0 || y >= this.height )
                throw new Error( "Coordinates aren't correct: " + x.toString() + " " + y.toString() );
            return this.map[y][x];
        };
        return Field;
    })();

    engine.Coordinate = (function(){
        function Coordinate(x,y){
            this.x = x;
            this.y = y;
        }
        return Coordinate;
    })();
    function distance(p1, p2) {
        //return Math.abs( p1.x-p2.x ) + Math.abs( p1.y-p2.y );
        return Math.sqrt( Math.pow( p1.x-p2.x, 2 ) + Math.pow( p1.y-p2.y, 2 ));
    };

    var Object = (function(){
        function Object(position){
            this.position = position;
        }
        Object.prototype.Live = function(time, world){
            throw new Error( "Never use clear Object!!! Inherit from it!!!" );
        };
        return Object;
    })();
    engine.Object = Object;

    engine.Unit = (function(){
        function Unit(type, position) {
            engine.Object.call(this, position);
            this.see_range = 10.0;
            this.speed = 0.01;
            this.type = type;
            this.destination = null;

        }
        Unit.prototype.IsNear = function( distance ) {
             return distance < 0.1 ? true : false;
        }
        Unit.prototype.Live = function( time, world) {
            // live
            this.Move( time, world );
        };
        Unit.prototype.Move = function( time, world ) {
            if( this.destination === null ) return;

            var total_distance = distance( this.position, this.destination );

            if( this.IsNear( total_distance ) ) {
                this.destination = null;
                return;
            }

            var current_ceil = world.get( Math.floor( this.position.x), Math.floor( this.position.y ) );
            var speed = this.speed / current_ceil.type.friction;
            var dir = {   x: (this.destination.x - this.position.x)/total_distance,
                        y: (this.destination.y - this.position.y)/total_distance };

            var distance_per_time = speed * time;

            if( total_distance <= distance_per_time ) {
                this.position = auxiliary.clone( this.destination );
                this.destination = null;
            } else {
                var speed_vector = {x: speed * dir.x,
                                    y: speed * dir.y};

                this.position.x += speed_vector.x * time;
                this.position.y += speed_vector.y * time;
            }
        };
        Unit.prototype.SetDestination = function(destination) {
            this.destination = destination;
        }

        auxiliary.inherit_B(Unit, Object);

        return Unit;
    })();

    engine.CreateTeam = function(teammates_count) {
        var team = [];

        for( var i = 0; i < teammates_count; i++ ) team.push( new engine.Unit(auxiliary.clone(auxiliary.GetRandom(engine.Units)), new engine.Coordinate(Math.random(), Math.random())) );

        return team;
    };

    engine.Game = (function(){
        function Game(fieldWidth, fieldHeight, timeStep) {
            this.id = '';
            this.players = [];
            this.timeIntervalDescriptor = null;
            this.world = new engine.Field(fieldWidth, fieldHeight);
            this.timeStep = timeStep;
        };
        Game.prototype.Live = function() {
            var g = this;
            try{
                g.players.forEach( function( player ) {
                    player.team.forEach( function( unit ) {
                        unit.Live( /*g.timeStep*/1, g.world );
                    } );
                } );
            } catch(e) {
                console.error(e.message);
            }
        };
        Game.prototype.Start = function() {
            var g = this;
            this.timeIntervalDescriptor = setInterval( function(){g.Live();}, this.timeStep );
        };
        Game.prototype.Stop = function() {
            if( this.timeIntervalDescriptor ) clearInterval( this.timeIntervalDescriptor );
        };
        Game.prototype.AddPlayer = function(player) {
            this.players.push(player);
        };
        return Game;
    })();

    engine.Player = (function(){
        function Player(team, game){
            this.team = team;
            this.linkToGame = game;
            game.AddPlayer(this);
        }
        return Player;
    })();

    engine.Situation = (function() {
        function Situation() {
            this.team = [];
            this.otherObjects = [];
        }
        return Situation;
    })();
})(engine || (engine = {}));

try{
    module.exports = engine;
    console.log("It's server, Brother");
}catch(e)
{
    console.log("It's browser, Brother");
}

