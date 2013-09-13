/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:38
 * To change this template use File | Settings | File Templates.
 */

/// <reference path="engine.ts"/>

module visualization{

    function DrawCircle(canvas_control:CanvasRenderingContext2D, x:number, y:number, r:number, width:number = 3, color:string = '#000000') {
        canvas_control.beginPath();
        canvas_control.arc(x, y, r, 0, 2 * Math.PI, false);
        canvas_control.lineWidth = width;
        canvas_control.strokeStyle = color;
        canvas_control.stroke();
    }
    function DrawRound(canvas_control:CanvasRenderingContext2D, x:number, y:number, r:number, color:string = '#000000') {
        canvas_control.beginPath();
        canvas_control.arc(x, y, r, 0, 2 * Math.PI, false);
        canvas_control.fillStyle = color;
        canvas_control.fill();
    }
    function DrawText(canvas_control:CanvasRenderingContext2D, text:string, x:number, y:number, color:string = '#000000') {
        canvas_control.fillStyle = color;
        canvas_control.font = "italic 7pt Arial";
        canvas_control.fillText(text, x, y);
    }

    export function ShowField(canvas_control:CanvasRenderingContext2D, field:engine.Field, ceil_size:number):void {


        for(var y = 0; y < field.height; y++) for( var x = 0; x < field.width; x++ )
        {
            canvas_control.fillStyle = field.get(x, y).type.symbol;
            canvas_control.fillRect( x*ceil_size, y*ceil_size, ceil_size, ceil_size);
            canvas_control.strokeRect( x*ceil_size, y*ceil_size, ceil_size, ceil_size);
        }
    }
    export function ShowTeam(canvas_control:CanvasRenderingContext2D, field:engine.Field, ceil_size:number):void{
        for(var y = 0; y < field.height; y++) for( var x = 0; x < field.width; x++ )
         {
             var ceil = field.get(x, y);
             var x0 = x*ceil_size;
             var y0 = y*ceil_size;

             for( var i = 0; i < ceil.units.length; i++ )
             {
                 var unit:engine.Unit = ceil.units[i];
                 var unit_x = x0 + unit.x*ceil_size;
                 var unit_y = y0 + unit.y*ceil_size;
                 DrawRound(canvas_control, unit_x, unit_y, 10, unit.type.symbol);
                 DrawCircle(canvas_control, unit_x, unit_y, 10, 2);
                 DrawText(canvas_control, (i+1).toString(), unit_x, unit_y);

            }
         }
    }
}
