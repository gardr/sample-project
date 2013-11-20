var utility = {};

var typeOf = function(a, b) {
    return typeof a === b;
};

function _extend(target, list, dontCopyKeyList) {
    list.forEach(function(src) {
        if (!src) {
            return;
        }
        var key;
        for (key in src) {
            if (dontCopyKeyList.indexOf(key) === -1 && !typeOf(src[key], 'undefined') && src.hasOwnProperty(key)) {
                target[key] = src[key];
            }
        }
    });
    return target;
}

utility.extendExcept = function(keys) {
    return function(target) {
        return _extend(target, Array.prototype.slice.call(arguments, 1), keys);
    };
};

utility.extend = function(target) {
    return _extend(target, Array.prototype.slice.call(arguments, 1), []);
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
