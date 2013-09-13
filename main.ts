/**
 * Created with JetBrains WebStorm.
 * User: vasiliy.lomanov
 * Date: 11.09.13
 * Time: 11:59
 * To change this template use File | Settings | File Templates.
 */
/// <reference path="visualization.ts"/>

function main():void
{
    var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
    var canvas_control:CanvasRenderingContext2D = canvas.getContext('2d');

    var field = new engine.Field(50,50);

    field.get(1,1).units = engine.CreateTeam(5);

    visualization.ShowField(canvas_control, field, 64);
    visualization.ShowTeam(canvas_control, field, 64);
}
