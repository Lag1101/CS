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
        {
            if( typeof(temp[key]) != typeof(obj[key]) )
                temp[key] = new obj[key].constructor();
            temp[key] = this.clone(obj[key]);
        }
        return temp;
    },
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    GetRandom: function (array){
        return array[this.getRandomInt(0,array.length-1)]
    },
    extend: function (Child, Parent) {
        var F = function() {};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.superclass = Parent.prototype;
    } ,
    isInBounds :function(value, low, high) {
        return value >= low && value < high;
    },
    LZW:{
        // LZW-compress a string
        encode: function(s) {
            var dict = {};
            var data = (s + "").split("");
            var out = [];
            var currChar;
            var phrase = data[0];
            var code = 256;
            for (var i=1; i<data.length; i++) {
                currChar=data[i];
                if (dict[phrase + currChar] != null) {
                    phrase += currChar;
                }
                else {
                    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                    dict[phrase + currChar] = code;
                    code++;
                    phrase=currChar;
                }
            }
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            for (var i=0; i<out.length; i++) {
                out[i] = String.fromCharCode(out[i]);
            }
            return out.join("");
        },

        // Decompress an LZW-encoded string
        decode: function(s) {
            var dict = {};
            var data = (s + "").split("");
            var currChar = data[0];
            var oldPhrase = currChar;
            var out = [currChar];
            var code = 256;
            var phrase;
            for (var i=1; i<data.length; i++) {
                var currCode = data[i].charCodeAt(0);
                if (currCode < 256) {
                    phrase = data[i];
                }
                else {
                    phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
                }
                out.push(phrase);
                currChar = phrase.charAt(0);
                dict[code] = oldPhrase + currChar;
                code++;
                oldPhrase = phrase;
            }
            return out.join("");
        }
    }
};
try{
    module.exports = auxiliary;
    console.log("Server loaded ",__filename);
}catch(e)
{
    console.log("Client loaded ",'auxialary');
}