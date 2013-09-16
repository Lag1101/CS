/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 10.09.13
 * Time: 22:38
 * To change this template use File | Settings | File Templates.
 */

/// <reference path="engine.ts"/>

module visualization{
    function DrawRect(canvas_control:CanvasRenderingContext2D, x:number, y:number, width:number, height:number, color:string = '#000000') {
        canvas_control.fillStyle = color;
        canvas_control.fillRect( x, y, width, height);
    }
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

    export function ShowField(canvas_control:CanvasRenderingContext2D, field:engine.Field, team:engine.Unit[], ceil_size:number):void {

        for(var y = 0; y < field.height; y++) for( var x = 0; x < field.width; x++ )
        {
            DrawRect(canvas_control, x*ceil_size, y*ceil_size, ceil_size, ceil_size, field.get(x,y).type.symbol.get());
        }
    }
    export function ShowTeam(canvas_control:CanvasRenderingContext2D, team:engine.Unit[], ceil_size:number):void{
         for( var i = 0; i < team.length; i++ )
         {
             var unit:engine.Unit = team[i];
             var unit_x = unit.position.x*ceil_size, unit_y = unit.position.y*ceil_size;
             DrawRound(canvas_control, unit_x, unit_y, 10, unit.type.symbol.get());
             DrawCircle(canvas_control, unit_x, unit_y, 10, 2);
             DrawText(canvas_control, (i+1).toString(), unit_x, unit_y);
        }
    }

}
