/* jshint noarg:false */
var util = require('../utility.js');
var CALLSTACK_MAX_DEPTH = 10;
var FN_NAME_REGEX = /function ([\w\d\-_]+)\s*\(/;

function getName(f) {
    return f.name || (FN_NAME_REGEX.test(f.toString()) ? RegExp.$1 : '{anonymous}');
}

function makeLogFn (out, name) {
    return function (level) {
        return function (objOrMsg) {
            if (typeof objOrMsg === 'string') {
                objOrMsg = {msg: objOrMsg};
            }
            out( util.extend({
                level: level,
                name: name,
                time: new Date().getTime()
            }, objOrMsg) );
        };
    };
}

function retrieveErrorData (evt, caller) {
    var output = {
        msg: evt.message,
        url: evt.filename,
        line: evt.lineno,
        stack: []
    };
    try {
        var i = CALLSTACK_MAX_DEPTH;
        while (caller && i--) {
            output.stack.push(getName(caller));
            caller = caller.caller;
        }
    } catch (e) {}
    return output;
}

function create(name, strLevel, out) {
	var level = parseInt(strLevel || '0', 10);
    var log = makeLogFn(out, name);
    var noop = function () {};
    var logInstance = {
        level: level,
        error:  (level >= 1 ? log(1) : noop),
        warn:   (level >= 2 ? log(2) : noop),
        info:   (level >= 3 ? log(3) : noop),
        debug:  (level >= 4 ? log(4) : noop),
    };

    if (level > 0) {
        util.on('error', window, function (e) {
            var caller = arguments.callee && arguments.callee.caller;
            logInstance.error( retrieveErrorData(e, caller) );
        });
    }
    
    return logInstance;
}

module.exports = {
	create: create
};