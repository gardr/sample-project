var internals = {};

var typeOf = function(a, b) {
    return typeof a === b;
};

internals.extendExcept = function(keys) {
    return function(target) {
        return _extend(target, Array.prototype.slice.call(arguments, 1), keys);
    };
};

internals.extend = function(target) {
    return _extend(target, Array.prototype.slice.call(arguments, 1), []);
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

internals.on = function(name, elem, func) {
    if (elem.addEventListener) {
        elem.addEventListener(name, func, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + name, func);
    }
};

internals.isFunction = function(fn) {
    return typeOf(fn, 'function');
};

internals.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

internals.isUndef = function(v) {
    return typeOf(v, 'undefined');
};

internals.isString = function(v) {
    return typeOf(v, 'string');
};

internals.isNumber = function(v) {
    return typeOf(v, 'number');
};

internals.isBoolean = function(v) {
    return typeOf(v, 'boolean');
};

// internals.isNodeList = function(el){
//     return !!(
//         (
//             window.NodeList &&
//             el instanceof window.NodeList
//         ) ||
//         (
//             internals.isNumber(el.length) &&
//             internals.isFunction(el.item) &&
//             internals.isFunction(el.nextNode) &&
//             internals.isFunction(el.reset)
//         )
//     );
// };

module.exports = internals;
