var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created with JetBrains WebStorm.
* User: loman_000
* Date: 10.09.13
* Time: 22:11
* To change this template use File | Settings | File Templates.
*/
var engine;
(function (engine) {
    (function (UnitType) {
        UnitType[UnitType["sniper"] = 0] = "sniper";
        UnitType[UnitType["engineer"] = 1] = "engineer";
        UnitType[UnitType["soldier"] = 2] = "soldier";
    })(engine.UnitType || (engine.UnitType = {}));
    var UnitType = engine.UnitType;
    (function (GroundType) {
        GroundType[GroundType["forest"] = 0] = "forest";
        GroundType[GroundType["city"] = 1] = "city";
        GroundType[GroundType["tower"] = 2] = "tower";
    })(engine.GroundType || (engine.GroundType = {}));
    var GroundType = engine.GroundType;

    var Color = (function () {
        function Color(r, g, b, a) {
            if (typeof a === "undefined") { a = 1.0; }
            this.r = 0.0;
            this.g = 0.0;
            this.b = 0.0;
            this.a = 1.0;
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        Color.prototype.get = function () {
            return 'rgba(' + this.r.toString() + ',' + this.g.toString() + ',' + this.b.toString() + ',' + this.a.toString() + ')';
        };
        return Color;
    })();
    engine.Color = Color;

    var Properties = (function () {
        function Properties(id, symbol) {
            this.id = id;
            this.symbol = symbol;
        }
        return Properties;
    })();
    engine.Properties = Properties;
    var UnitProperties = (function (_super) {
        __extends(UnitProperties, _super);
        function UnitProperties(id, symbol) {
            _super.call(this, id, symbol);
            this.health = 100;
            this.speed = 0.1;
        }
        return UnitProperties;
    })(Properties);
    engine.UnitProperties = UnitProperties;

    var CeilProperties = (function (_super) {
        __extends(CeilProperties, _super);
        function CeilProperties(id, symbol, friction) {
            if (typeof friction === "undefined") { friction = 1.0; }
            _super.call(this, id, symbol);
            this.friction = 1.0;
            this.friction = friction;
        }
        return CeilProperties;
    })(Properties);
    engine.CeilProperties = CeilProperties;

    function clone(obj) {
        if (obj == null || typeof (obj) != 'object')
            return obj;
        var temp = new obj.constructor();
        for (var key in obj)
            temp[key] = clone(obj[key]);
        return temp;
    }

    engine.Fields = [
        new CeilProperties(engine.GroundType.forest, new Color(255, 0, 255, 1.0), 1.5),
        new CeilProperties(engine.GroundType.city, new Color(255, 255, 0, 1.0), 1.2),
        new CeilProperties(engine.GroundType.tower, new Color(0, 255, 255, 1.0), 1.0)
    ];
    engine.Units = [
        new UnitProperties(engine.UnitType.sniper, new Color(255, 0, 0, 1.0)),
        new UnitProperties(engine.UnitType.engineer, new Color(0, 0, 255, 1.0)),
        new UnitProperties(engine.UnitType.soldier, new Color(0, 255, 0, 1.0))
    ];

    var Coordinate = (function () {
        function Coordinate(x, y) {
            this.x = 0;
            this.y = 0;
            this.x = x;
            this.y = y;
        }
        Coordinate.distance = function (p1, p2) {
            //return Math.abs( p1.x-p2.x ) + Math.abs( p1.y-p2.y );
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        };
        return Coordinate;
    })();
    engine.Coordinate = Coordinate;

    var Ceil = (function () {
        function Ceil(type) {
            this.type = type;
        }
        return Ceil;
    })();
    engine.Ceil = Ceil;

    var Unit = (function () {
        function Unit(type, position) {
            this.see_range = 10.0;
            this.speed = 1.0;
            this.type = type;
            this.position = position;
        }
        Unit.prototype.HowUnitCanSeeThis = function (coordinate) {
            var r = Coordinate.distance(this.position, coordinate);
            if (r >= this.see_range)
                return 0;
else
                //return 1;
                return (this.see_range - r) / this.see_range;
        };
        Unit.prototype.MoveToAim = function (aim, field, time) {
            var current_ceil = field.get(Math.floor(this.position.x), Math.floor(this.position.y));
            var speed = this.speed / current_ceil.type.friction;
            var alpha = Math.atan2(aim.x - this.position.x, aim.y - this.position.y);

            this.position.x += speed * Math.cos(alpha) * time;
            this.position.y += speed * Math.sin(alpha) * time;
        };
        return Unit;
    })();
    engine.Unit = Unit;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function GetRandom(array) {
        return array[getRandomInt(0, array.length - 1)];
    }

    var Field = (function () {
        function Field(width, height) {
            this.width = width;
            this.height = height;
            this.map = [];

            for (var y = 0; y < height; y++) {
                var line = [];
                for (var x = 0; x < width; x++)
                    line.push(new Ceil(clone(GetRandom(engine.Fields))));
                this.map.push(line);
            }
        }
        Field.prototype.get = function (x, y) {
            return this.map[y][x];
        };
        Field.prototype.MakeFogOfTheWar = function (team) {
            for (var y = 0.0; y < this.height; y++) {
                var line = this.map[y];
                for (var x = 0.0; x < this.width; x++) {
                    var max_see_ability = 0.0;
                    var ceil_coordinate = new Coordinate(x + 0.5, y + 0.5);
                    for (var i = 0; i < team.length; i++) {
                        var see_ability = team[i].HowUnitCanSeeThis(ceil_coordinate);
                        if (see_ability > max_see_ability)
                            max_see_ability = see_ability;
                    }
                    line[x].type.symbol.a = max_see_ability;
                }
            }
        };
        return Field;
    })();
    engine.Field = Field;

    function CreateTeam(teammates_count) {
        var team = [];

        for (var i = 0; i < teammates_count; i++)
            team.push(new Unit(clone(GetRandom(engine.Units)), new Coordinate(Math.random(), Math.random())));

        return team;
    }
    engine.CreateTeam = CreateTeam;
})(engine || (engine = {}));
//# sourceMappingURL=engine.js.map
