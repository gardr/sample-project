/*
    Communication from and to banner container
*/
var eventListener = require('eventlistener');
var com = {};

com.PREFIX = 'GARDR';
com.PARENT_PREFIX = 'MANAGER';
com.GLOBAL_POSTMESSAGE_FALLBACK = '__' + com.PREFIX + '_POSTMESSAGE_FALLBACK';
com.ORIGIN_KEY = 'origin';

/*

*/
var getOriginFromUrl = function(url) {
    return url.indexOf(com.ORIGIN_KEY) >= 0 ?
        url.split(com.ORIGIN_KEY)[1].split(/&|&amp;/gmi)[0].replace(/^=/, '') : '';
};

/*  */
com._postMessage = function(targetOrigin, targetWindow, prefix) {
    prefix = (typeof prefix == 'string') ? prefix : com.PREFIX;
    // targetOrigin implementation deviates in IE8, "*" not supported
    if (!targetOrigin || targetOrigin === '*') {
        targetOrigin = getOriginFromUrl(window.location.toString());
        if (!targetOrigin) {
            return;
        }
    }
    // default to parent window
    targetWindow = targetWindow || window.top;

    return function(msg) {
        try {
            msg = prefix + JSON.stringify(msg || '');
            targetWindow.postMessage(msg, targetOrigin);
        } catch (e) {
            if (global.console) {
                global.console.error(e);
            }
        }
    };
};

/* Handle incomming messages */
com.incomming = function(cb, prefix) {
    if (typeof cb != 'function') {
        throw new Error('Missing callback');
    }
    prefix = prefix || com.PREFIX;

    eventListener.add(global, 'message', function(e) {
        var res = e.data;
        if (res && typeof res == 'string' && res.indexOf(prefix) === 0) {
            try {
                var input = res.substring(prefix.length);
                res = JSON.parse(input);
            } catch (err) {}
            cb(res, e.source, e.origin);
        }
    }, false);
};

com.createOutgoing = function(origin, targetWindow, prefix) {
    return com._postMessage(origin, targetWindow, prefix || com.PARENT_PREFIX);
};

/*
    Be sure to talk to manager in the most parent iframe.
*/
com.createManagerConnection = function(origin, prefix) {
    return com.createOutgoing(origin, global.parent || global.top, prefix);
};

module.exports = com;
