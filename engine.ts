/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:11
 * To change this template use File | Settings | File Templates.
 */
module engine{

    export class Type{
        name:string = '';
        symbol = '';
        constructor(name: string, symbol){
            this.name = name;
            this.symbol = symbol;
        }
    }
    export var FieldType:Array = [
        new Type("forest", "green"),
        new Type("city", "brown"),
        new Type("tower", "gray")
    ];
    export var UnitType:Array = [
        new Type("sniper", "green"),
        new Type("engineer", "brown"),
        new Type("soldier", "gray")
    ];

    export class Unit{
        type:Type;
        constructor(type:Type) {
            this.type = type;
        }
    }
    export class Ceil{
        type:Type;
        units:Array;
        constructor(type:Type, units:Array) {
            this.type = type;
            this.units = units;
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    Array.prototype.GetRandom = function(){
         return this[getRandomInt(0,this.length-1)]
    }

    export class Field{
        map:Array;
        width:number;
        height:number;
        constructor(width:number, height:number) {
            this.width = width;
            this.height = height;
            this.map = [];

            for( var y = 0; y < height; y++ )
            {
                var line = [];
                for( var x = 0; x < width; x++ ) line.push( new Ceil( FieldType.GetRandom(), []) );
                    this.map.push(line);
            }
        }
        get(x:number, y:number):Ceil{
            return this.map[y][x];
        }
    }

    export function CreateTeam(teammates_count:number):Array{
        var team = [];

        for( var i = 0; i < teammates_count; i++ ) team.push( new Unit(UnitType.GetRandom()) );

        return team;
    }
};
