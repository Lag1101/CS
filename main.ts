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
    var canvas_control = document.getElementById('canvas').getContext('2d');

    var width=1024;
    var height=1024;

    canvas_control.width = width;
    canvas_control.height = height;

    var field = new engine.Field(50,50);
    visualization.ShowField(canvas_control, field, 64);

    var team = engine.CreateTeam(5);

    field.get(0,0).units = team;



}

main();
