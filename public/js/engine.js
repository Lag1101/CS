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
    UnitType = {
        sniper:'sniper',
        engineer:'engineer',
        soldier:'soldier'
    };
    GroundType = {
        forest:'forest',
        city:'city',
        tower:'tower'
    };
    engine.UnitType = UnitType;
    engine.GroundType = GroundType;

    var Color = (function(){
        function Color(r,g,b,a){
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        };
        Color.prototype.get = function(){
            return 'rgba(' +
                this.r.toString() + ',' +
                this.g.toString() + ',' +
                this.b.toString() + ',' +
                this.a.toString() + ')';
        };
        return Color;
    })();
    engine.Color = Color;

    var Properties = (function(){
         function Properties(id, symbol){
             this.id = id;
             this.symbol = symbol;
         };
         return Properties;
     })();
    var UnitProperties = (function(){
        function UnitProperties(id, symbol){
            Properties.call(this, id, symbol);
            this.health = 100;
            this.speed = 0.1;
        };
        auxiliary.inherit_B(UnitProperties, Properties);
        return UnitProperties;
    })();
    engine.UnitProperties = UnitProperties;

    var CeilProperties = (function(){
        function CeilProperties(id, symbol, friction){
            Properties.call(this, id, symbol);
            this.friction = friction ? friction : 1.0;
        };
        auxiliary.inherit_B(CeilProperties, Properties);
        return CeilProperties;
    })();
    engine.CeilProperties = CeilProperties;
    
    Fields = [
        new CeilProperties(GroundType.forest,    new Color(255,0,255,0.5),   1.5),
        new CeilProperties(GroundType.city,      new Color(255,255,0,0.5),   1.2),
        new CeilProperties(GroundType.tower,     new Color(0,255,255,0.5),   1.0)
    ];
    engine.Fields = Fields;
    Units = [
        new UnitProperties(UnitType.sniper,   new Color(255,0,0,1.0)),
        new UnitProperties(UnitType.engineer, new Color(0,0,255,1.0)),
        new UnitProperties(UnitType.soldier,  new Color(0,255,0,1.0))
    ];
    engine.Units = Units;

    var Ceil = (function(){
        function Ceil( type ){
            this.type = type;
        };
        return Ceil;
    })();
    engine.Ceil = Ceil;

    var Field = (function(){
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
        };
        Field.prototype.get = function(x, y){
            return this.map[y][x];
        };
        return Field;
    })();
    engine.Field = Field;

    var Coordinate = (function(){
        function Coordinate(x,y){
            this.x = x;
            this.y = y;
        };
        Coordinate.prototype.distance = function(p1, p2) {
            //return Math.abs( p1.x-p2.x ) + Math.abs( p1.y-p2.y );
            return Math.sqrt( Math.pow( p1.x-p2.x, 2 ) + Math.pow( p1.y-p2.y, 2 ));
        };
        return Coordinate;
    })();
    engine.Coordinate = Coordinate;

    var Object = (function(){
        function Object(position){
            this.position = position;
        };
        Object.prototype.Live = function(time, world){
            throw new Error( "Never use clear Object!!! Inherit from it!!!" );
        };
        return Object;
    })();
    engine.Object = Object;

    var Unit = (function(){
        function Unit(type, position) {
            engine.Object.call(this, position);
            this.see_range = 10.0;
            this.speed = 1.0;
            this.type = type;
        }
        Unit.prototype.Live = function(time, world) {
            // live
        };
        Unit.prototype.MoveToAim = function(aim, field, time) {
            var current_ceil = field.get( Math.floor(this.position.x), Math.floor(this.position.y) );
            var speed = this.speed / current_ceil.type.friction;
            var alpha = Math.atan2( aim.x - this.position.x, aim.y - this.position.y );

            this.position.x += speed * Math.cos( alpha ) * time;
            this.position.y += speed * Math.sin( alpha ) * time;
        };

        auxiliary.inherit_B(Unit, Object);

        return Unit;
    })();
    engine.Unit = Unit;

    engine.CreateTeam = function(teammates_count) {
        var team = [];

        for( var i = 0; i < teammates_count; i++ ) team.push( new engine.Unit(auxiliary.clone(auxiliary.GetRandom(engine.Units)), new engine.Coordinate(Math.random(), Math.random())) );

        return team;
    }

    var Game = (function(){
        function Game(fieldWidth, fieldHeight, timeStep) {
            this.id = '';
            this.objectPool = [];
            this.timeIntervalDescriptor = null;
            this.world = new engine.Field(fieldWidth, fieldHeight);
            this.timeStep = timeStep;
        };
        Game.prototype.Live = function() {
            var g = this;
            g.objectPool.forEach( function( object ) {
                object.Live( g.timeStep, g.world );
                object.x = Math.random();
                object.y = Math.random();
            } );
        };
        Game.prototype.Start = function() {
            var g = this;
            this.timeIntervalDescriptor = setInterval( function(){g.Live();}, this.timeStep );
        };
        Game.prototype.Stop = function() {
            if( this.timeIntervalDescriptor ) clearInterval( this.timeIntervalDescriptor );
        };
        Game.prototype.AddObject = function(object) {
            this.objectPool.push(object);
        };
        Game.prototype.AddObjects = function(objects) {
            var g = this;
            objects.forEach( function( object ){ g.AddObject(object); });
        };
        return Game;
    })();
    engine.Game = Game;

    var Player = (function(){
        function Player(res, team, game){
            this.team = team;
            this.res = res;
            this.linkToGame = game;
            game.AddObjects(this.team);
        }
        return Player;
    })();
    engine.Player = Player;
})(engine || (engine = {}));

try{
    module.exports = engine;
    console.log("It's server, Brother");
}catch(e)
{
    console.log("It's browser, Brother");
}

