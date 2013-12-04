var utility = {};

var typeOf = function(a, b) {
    return typeof a === b;
};

utility.on = function(name, elem, func) {
    if (elem.addEventListener) {
        elem.addEventListener(name, func, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + name, func);
    }
};

utility.isFunction = function(fn) {
    return typeOf(fn, 'function');
};

utility.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

utility.isUndef = function(v) {
    return typeOf(v, 'undefined');
};

utility.isString = function(v) {
    return typeOf(v, 'string');
};

utility.isNumber = function(v) {
    return typeOf(v, 'number');
};

utility.isBoolean = function(v) {
    return typeOf(v, 'boolean');
};

module.exports = utility;
