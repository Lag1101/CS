/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:38
 * To change this template use File | Settings | File Templates.
 */

/// <reference path="engine.ts"/>

module visualization{
    function ShowField(canvas_control:CanvasRenderingContext2D, field:engine.Field, ceil_size:number):void {
        for(var y = 0; y < field.height; y++) for( var x = 0; x < field.width; x++ )
            canvas_control.fillRect( x*ceil_size, y*ceil_size, (x+1)*ceil_size, (y+1)*ceil_size);
    }
};
