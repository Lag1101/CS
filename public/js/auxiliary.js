/**
 * Created with JetBrains WebStorm.
 * User: loman_000
 * Date: 23.09.13
 * Time: 22:42
 * To change this template use File | Settings | File Templates.
 */

var auxiliary = {
    clone: function(obj){
        if(obj == null || typeof(obj) != 'object')
            return obj;
        var temp = new obj.constructor();
        for(var key in obj)
            temp[key] = this.clone(obj[key]);
        return temp;
    },
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    GetRandom: function (array){
        return array[this.getRandomInt(0,array.length-1)]
    },
    extend: function (Child, Parent) {
        var F = function() { }
        F.prototype = Parent.prototype
        Child.prototype = new F()
        Child.prototype.constructor = Child
        Child.superclass = Parent.prototype
    }
};
try{
    module.exports = auxiliary;
    console.log("It's server, Brother");
}catch(e)
{
    console.log("It's browser, Brother");
}