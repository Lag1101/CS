/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:11
 * To change this template use File | Settings | File Templates.
 */
module engine{

    export enum UnitType{sniper, engineer, soldier}
    export enum GroundType{forest, city, tower}

    export class Color{
        r:number=0.0;
        g:number=0.0;
        b:number=0.0;
        a:number=1.0;
        constructor(r:number,g:number,b:number,a:number=1.0) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        get():string{
            var res = 'rgba(' +
                this.r.toString() + ',' +
                this.g.toString() + ',' +
                this.b.toString() + ',' +
                this.a.toString() + ')';
            return res;
        }
    }

    export class Properties{
        id;
        symbol:Color;
        constructor(id, symbol:Color){
            this.id = id;
            this.symbol = symbol;
        }
    }
    export class UnitProperties extends Properties{
        health:number = 100;
        speed:number = 0.1;
        constructor(id, symbol:Color)
        {
            super(id, symbol);
        }
    };

    export class CeilProperties extends Properties{
        friction:number = 1.0;
        constructor(id, symbol:Color, friction:number = 1.0)
        {
            super(id, symbol);
            this.friction = friction;
        }
    };

    function clone(obj){
        if(obj == null || typeof(obj) != 'object')
            return obj;
        var temp = new obj.constructor();
        for(var key in obj)
            temp[key] = clone(obj[key]);
        return temp;
    }

    export var Fields:CeilProperties[] = [
        new CeilProperties(engine.GroundType.forest,    new Color(255,0,255,1.0),   1.5),
        new CeilProperties(engine.GroundType.city,      new Color(255,255,0,1.0),   1.2),
        new CeilProperties(engine.GroundType.tower,     new Color(0,255,255,1.0),   1.0)
    ];
    export var Units:UnitProperties[] = [
        new UnitProperties(engine.UnitType.sniper, new Color(255,0,0,1.0)),
        new UnitProperties(engine.UnitType.engineer, new Color(0,0,255,1.0)),
        new UnitProperties(engine.UnitType.soldier, new Color(0,255,0,1.0))
    ];


    export class Coordinate{
        x:number = 0;
        y:number = 0;
        constructor(x:number ,y:number)
        {
            this.x = x;
            this.y = y;
        }
        static distance(p1:Coordinate, p2:Coordinate):number {
            //return Math.abs( p1.x-p2.x ) + Math.abs( p1.y-p2.y );
            return Math.sqrt( Math.pow( p1.x-p2.x, 2 ) + Math.pow( p1.y-p2.y, 2 ));
        }
    }

    export class Ceil{
        type:engine.CeilProperties;
        constructor(type:engine.CeilProperties) {
            this.type = type;
        }
    }

    export class Unit{
        type:engine.UnitProperties;
        position:Coordinate;
        see_range:number = 10.0;
        speed:number = 1.0;
        constructor(type:engine.UnitProperties, position:Coordinate) {
            this.type = type;
            this.position = position;
        }
        HowUnitCanSeeThis(coordinate:Coordinate)
        {
            var r = Coordinate.distance(this.position, coordinate);
            if( r >= this.see_range )
                return 0;
            else
                //return 1;
                return (this.see_range - r) / this.see_range;
        }
        MoveToAim(aim:Coordinate, field:Field, time:number):void {
            var current_ceil:Ceil = field.get( Math.floor(this.position.x), Math.floor(this.position.y) );
            var speed = this.speed / current_ceil.type.friction;
            var alpha = Math.atan2( aim.x - this.position.x, aim.y - this.position.y )

            this.position.x += speed * Math.cos( alpha ) * time;
            this.position.y += speed * Math.sin( alpha ) * time;
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function GetRandom(array:any[]){
         return array[getRandomInt(0,array.length-1)]
    }

    export class Field{
        map:Ceil[][];
        width:number;
        height:number;
        constructor(width:number, height:number) {
            this.width = width;
            this.height = height;
            this.map = [];

            for( var y = 0; y < height; y++ )
            {
                var line = [];
                for( var x = 0; x < width; x++ ) line.push( new Ceil( clone(GetRandom(Fields)) ));
                this.map.push(line);
            }
        }
        get(x:number, y:number):Ceil{
            return this.map[y][x];
        }
        MakeFogOfTheWar(team:Unit[]) {

            for(var y = 0.0; y < this.height; y++)
            {
                var line:Ceil[] = this.map[y];
                for( var x = 0.0; x < this.width; x++ )
                {
                    var max_see_ability = 0.0;
                    var ceil_coordinate = new Coordinate(x+0.5, y+0.5);
                    for(var i = 0; i < team.length; i++)
                    {
                        var see_ability = team[i].HowUnitCanSeeThis( ceil_coordinate );
                        if( see_ability > max_see_ability ) max_see_ability = see_ability;
                    }
                    line[x].type.symbol.a = max_see_ability;
                }
            }
        }
    }

    export function CreateTeam(teammates_count:number):Unit[]{
        var team:Unit[] = [];

        for( var i = 0; i < teammates_count; i++ ) team.push( new Unit(clone(GetRandom(Units)), new Coordinate(Math.random(), Math.random())) );

        return team;
    }
}
