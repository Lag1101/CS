/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:11
 * To change this template use File | Settings | File Templates.
 */
module engine{
    export var FieldType:Array = [
        "forest",
        "city"
    ];


    export var UnitType = [
        "sniper",
        "engineer",
        "soldier"
    ];

    export class Unit{
        type:string;
        constructor(type:string) {
            this.type = type;
        }
    }
    export class Ceil{
        type:string;
        units:Array;
        constructor(type:string, units:Array) {
            this.type = type;
            this.units = units;
        }
    }

    export class Field{
        map:Array;
        width:number;
        height:number;
        constructor(width:number, height:number) {
            this.width = width;
            this.height = height;
            var line:Array = [];
            for( var i = 0; i < width; i++ ) line.push( new Ceil( FieldType[0], []) );
            for( var i = 0; i < height; i++ ) this.map.push(line);
        }
        get(x:number, y:number):Ceil{
            return this.map[y][x];
        }
    }
};
