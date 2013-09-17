/**
 * Created with JetBrains WebStorm.
 * User: vasiliy.lomanov
 * Date: 17.09.13
 * Time: 14:32
 * To change this template use File | Settings | File Templates.
 */

module auxiliary{
    export function clone(obj){
        if(obj == null || typeof(obj) != 'object')
            return obj;
        var temp = new obj.constructor();
        for(var key in obj)
            temp[key] = clone(obj[key]);
        return temp;
    }
    export function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    export function GetRandom(array:any[]){
        return array[getRandomInt(0,array.length-1)]
    }

}