(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"],{

/***/ "./node_modules/guid-typescript/dist/guid.js":
/*!***************************************************!*\
  !*** ./node_modules/guid-typescript/dist/guid.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Guid = /** @class */ (function () {
    function Guid(guid) {
        if (!guid) {
            throw new TypeError("Invalid argument; `value` has no value.");
        }
        this.value = Guid.EMPTY;
        if (guid && Guid.isGuid(guid)) {
            this.value = guid;
        }
    }
    Guid.isGuid = function (guid) {
        var value = guid.toString();
        return guid && (guid instanceof Guid || Guid.validator.test(value));
    };
    Guid.create = function () {
        return new Guid([Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-"));
    };
    Guid.createEmpty = function () {
        return new Guid("emptyguid");
    };
    Guid.parse = function (guid) {
        return new Guid(guid);
    };
    Guid.raw = function () {
        return [Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-");
    };
    Guid.gen = function (count) {
        var out = "";
        for (var i = 0; i < count; i++) {
            // tslint:disable-next-line:no-bitwise
            out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return out;
    };
    Guid.prototype.equals = function (other) {
        // Comparing string `value` against provided `guid` will auto-call
        // toString on `guid` for comparison
        return Guid.isGuid(other) && this.value === other.toString();
    };
    Guid.prototype.isEmpty = function () {
        return this.value === Guid.EMPTY;
    };
    Guid.prototype.toString = function () {
        return this.value;
    };
    Guid.prototype.toJSON = function () {
        return {
            value: this.value
        };
    };
    Guid.validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
    Guid.EMPTY = "00000000-0000-0000-0000-000000000000";
    return Guid;
}());
exports.Guid = Guid;


/***/ }),

/***/ "./node_modules/typescript-string-operations/dist/index.min.js":
/*!*********************************************************************!*\
  !*** ./node_modules/typescript-string-operations/dist/index.min.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var String = (function () {
    function String() {
    }
    String.IsNullOrWhiteSpace = function (value) {
        try {
            if (value == null || value == 'undefined') {
                return true;
            }
            return value.toString().replace(/\s/g, '').length < 1;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    };
    String.Join = function (delimiter) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        try {
            var firstArg = args[0];
            if (Array.isArray(firstArg) || firstArg instanceof Array) {
                var tempString = String.Empty;
                var count = 0;
                for (var i = 0; i < firstArg.length; i++) {
                    var current = firstArg[i];
                    if (i < firstArg.length - 1) {
                        tempString += current + delimiter;
                    }
                    else {
                        tempString += current;
                    }
                }
                return tempString;
            }
            else if (typeof firstArg === 'object') {
                var tempString_1 = String.Empty;
                var objectArg_1 = firstArg;
                var keys = Object.keys(firstArg);
                keys.forEach(function (element) { tempString_1 += objectArg_1[element] + delimiter; });
                tempString_1 = tempString_1.slice(0, tempString_1.length - delimiter.length);
                return tempString_1;
            }
            var stringArray = args;
            return String.join.apply(String, [delimiter].concat(stringArray));
        }
        catch (e) {
            console.log(e);
            return String.Empty;
        }
    };
    String.Format = function (format) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        try {
            if (format.match(String.regexNumber)) {
                return String.format(String.regexNumber, format, args);
            }
            if (format.match(String.regexObject)) {
                return String.format(String.regexObject, format, args, true);
            }
            return format;
        }
        catch (e) {
            console.log(e);
            return String.Empty;
        }
    };
    String.format = function (regex, format, args, parseByObject) {
        if (parseByObject === void 0) { parseByObject = false; }
        return format.replace(regex, function (match, x) {
            var s = match.split(':');
            if (s.length > 1) {
                x = s[0].replace('{', '');
                match = s[1].replace('}', '');
            }
            var arg;
            if (parseByObject) {
                arg = args[0][x];
            }
            else {
                arg = args[x];
            }
            if (arg == null || arg == undefined || match.match(/{\d+}/)) {
                return arg;
            }
            arg = String.parsePattern(match, arg);
            return typeof arg != 'undefined' && arg != null ? arg : String.Empty;
        });
    };
    String.parsePattern = function (match, arg) {
        switch (match) {
            case 'L': {
                arg = arg.toLowerCase();
                return arg;
            }
            case 'U': {
                arg = arg.toUpperCase();
                return arg;
            }
            case 'd': {
                if (typeof (arg) === 'string') {
                    return String.getDisplayDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return String.Format('{0:00}.{1:00}.{2:0000}', arg.getDate(), arg.getMonth(), arg.getFullYear());
                }
                break;
            }
            case 's': {
                if (typeof (arg) === 'string') {
                    return String.getSortableDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return String.Format('{0:0000}-{1:00}-{2:00}', arg.getFullYear(), arg.getMonth(), arg.getDate());
                }
                break;
            }
            case 'n': {
                if (typeof (arg) !== "string")
                    arg = arg.toString();
                var replacedString = arg.replace(/,/g, '.');
                if (isNaN(parseFloat(replacedString)) || replacedString.length <= 3) {
                    break;
                }
                var numberparts = replacedString.split(/[^0-9]+/g);
                var parts = numberparts;
                if (numberparts.length > 1) {
                    parts = [String.join.apply(String, [''].concat((numberparts.splice(0, numberparts.length - 1)))), numberparts[numberparts.length - 1]];
                }
                var integer = parts[0];
                var mod = integer.length % 3;
                var output = (mod > 0 ? (integer.substring(0, mod)) : String.Empty);
                var firstGroup = output;
                var remainingGroups = integer.substring(mod).match(/.{3}/g);
                output = output + '.' + String.Join('.', remainingGroups);
                arg = output + (parts.length > 1 ? ',' + parts[1] : '');
                return arg;
            }
            default: {
                break;
            }
        }
        if ((typeof (arg) === 'number' || !isNaN(arg)) && !isNaN(+match) && !String.IsNullOrWhiteSpace(arg)) {
            return String.formatNumber(arg, match);
        }
        return arg;
    };
    String.getDisplayDateFromString = function (input) {
        var splitted;
        splitted = input.split('-');
        if (splitted.length <= 1) {
            return input;
        }
        var day = splitted[splitted.length - 1];
        var month = splitted[splitted.length - 2];
        var year = splitted[splitted.length - 3];
        day = day.split('T')[0];
        day = day.split(' ')[0];
        return day + "." + month + "." + year;
    };
    String.getSortableDateFromString = function (input) {
        var splitted = input.replace(',', '').split('.');
        if (splitted.length <= 1) {
            return input;
        }
        var times = splitted[splitted.length - 1].split(' ');
        var time = String.Empty;
        if (times.length > 1) {
            time = times[times.length - 1];
        }
        var year = splitted[splitted.length - 1].split(' ')[0];
        var month = splitted[splitted.length - 2];
        var day = splitted[splitted.length - 3];
        var result = year + "-" + month + "-" + day;
        if (!String.IsNullOrWhiteSpace(time) && time.length > 1) {
            result += "T" + time;
        }
        else {
            result += "T00:00:00";
        }
        return result;
    };
    String.formatNumber = function (input, formatTemplate) {
        var count = formatTemplate.length;
        var stringValue = input.toString();
        if (count <= stringValue.length) {
            return stringValue;
        }
        var remainingCount = count - stringValue.length;
        remainingCount += 1;
        return new Array(remainingCount).join('0') + stringValue;
    };
    String.join = function (delimiter) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var temp = String.Empty;
        for (var i = 0; i < args.length; i++) {
            if ((typeof args[i] == 'string' && String.IsNullOrWhiteSpace(args[i]))
                || (typeof args[i] != "number" && typeof args[i] != "string")) {
                continue;
            }
            var arg = "" + args[i];
            temp += arg;
            for (var i2 = i + 1; i2 < args.length; i2++) {
                if (String.IsNullOrWhiteSpace(args[i2])) {
                    continue;
                }
                temp += delimiter;
                i = i2 - 1;
                break;
            }
        }
        return temp;
    };
    String.regexNumber = /{(\d+(:\w*)?)}/g;
    String.regexObject = /{(\w+(:\w*)?)}/g;
    String.Empty = '';
    return String;
}());
exports.String = String;
var StringBuilder = (function () {
    function StringBuilder(value) {
        if (value === void 0) { value = String.Empty; }
        this.Values = [];
        this.Values = new Array(value);
    }
    StringBuilder.prototype.ToString = function () {
        return this.Values.join('');
    };
    StringBuilder.prototype.Append = function (value) {
        this.Values.push(value);
    };
    StringBuilder.prototype.AppendFormat = function (format) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.Values.push(String.Format.apply(String, [format].concat(args)));
    };
    StringBuilder.prototype.Clear = function () {
        this.Values = [];
    };
    return StringBuilder;
}());
exports.StringBuilder = StringBuilder;


/***/ }),

/***/ "./src/app/models/constants.ts":
/*!*************************************!*\
  !*** ./src/app/models/constants.ts ***!
  \*************************************/
/*! exports provided: Constants */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Constants", function() { return Constants; });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.Superadmin = "Superadmin";
    Constants.Brewer = "brewer";
    Constants.OrgSuperUser = "Org Super User";
    Constants.OrgAdminUser = "Org Admin User";
    Constants.OrgDashboardUser = "Org Dashboard User";
    Constants.DemoUser = "Demo User";
    return Constants;
}());



/***/ })

}]);
//# sourceMappingURL=common-es5.js.map