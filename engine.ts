/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:11
 * To change this template use File | Settings | File Templates.
 */
module engine{

    export enum Units{sniper, engineer, soldier}
    export enum Fields{forest, city, tower}

    export class Type{
        id;
        symbol;
        constructor(id, symbol){
            this.id = id;
            this.symbol = symbol;
        }
    }

    export var FieldType:Array = [
        new Type(Fields.forest, "green"),
        new Type(Fields.city, "brown"),
        new Type(Fields.tower, "gray")
    ];
    export var UnitType:Array = [
        new Type(Units.sniper, "red"),
        new Type(Units.engineer, "blue"),
        new Type(Units.soldier, "#275723")
    ];

    export class Unit{
        type:Type;
        x:number;
        y:number;   // x, y - mast be values in range [0,1)
        constructor(type:Type, x:number=0.5, y:number=0.5) {
            this.type = type;
            this.x = x;
            this.y = y;
        }
    }
    export class Ceil{
        type:Type;
        units:Unit[];
        constructor(type:Type, units:Unit[]) {
            this.type = type;
            this.units = units;
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function GetRandom(array:any[]){
         return array[getRandomInt(0,array.length-1)]
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
                for( var x = 0; x < width; x++ ) line.push( new Ceil( GetRandom(FieldType), []) );
                    this.map.push(line);
            }
        }
        get(x:number, y:number):Ceil{
            return this.map[y][x];
        }
    }

    export function CreateTeam(teammates_count:number):Array{
        var team = [];

        for( var i = 0; i < teammates_count; i++ ) team.push( new Unit(GetRandom(UnitType), Math.random(), Math.random()) );

        return team;
    }
}
