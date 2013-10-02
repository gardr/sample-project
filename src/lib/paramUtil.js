var util = require('./utility.js');

var paramUtils = {};

/* using escape and unescape for utf8/iso-issues? */
var REXP_SPLIT = /&amp;|&|;/gmi;
paramUtils.deparam = function(str, sep) {
    sep = sep||REXP_SPLIT;
    var result = {};
    var expr = str.split(sep);
    var key, val, index;
    for (var i = 0, len = expr.length; i < len; i++) {
        index = expr[i].indexOf('=');
        key = expr[i].substring(0, index);
        val = expr[i].substring(index+1);
        if (val) {
            result[decodeURIComponent(key)] = decodeURIComponent(val);
        }
    }
    return result;
};

paramUtils.param = function(o, sep) {
    var list = [];
    var key;
    for (key in o) {
        if (typeof o[key] !== 'undefined' && typeof o[key] !== 'object' && !util.isFunction(o[key])) {
            list.push(encodeURIComponent(key) + '=' + encodeURIComponent(o[key]));
        }
    }
    return list.join(sep || '&');
};

module.exports = paramUtils;