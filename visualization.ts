/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:38
 * To change this template use File | Settings | File Templates.
 */

/// <reference path="engine.ts"/>

module visualization{


    export function ShowField(canvas_control:CanvasRenderingContext2D, field:engine.Field, ceil_size:number):void {


        for(var y = 0; y < field.height; y++) for( var x = 0; x < field.width; x++ )
        {
            canvas_control.fillStyle = field.get(x, y).type.symbol;
            canvas_control.fillRect( x*ceil_size, y*ceil_size, ceil_size, ceil_size);
            canvas_control.strokeRect( x*ceil_size, y*ceil_size, ceil_size, ceil_size);
        }
    }
};
