var utility = require('./utility.js');
var paramUtil = require('./paramUtil.js');
var support = require('./support.js');
/*
    Communication from and to banner container
*/
var internals = {};

internals.PREFIX = 'PASTIES';
internals.PARENT_PREFIX = 'MANAGER';
internals.GLOBAL_POSTMESSAGE_FALLBACK = '__' + internals.PREFIX + '_POSTMESSAGE_FALLBACK';
internals.ORIGIN_KEY = 'origin';

/*

*/
var getOriginFromUrl = function(url) {
    return url.indexOf(internals.ORIGIN_KEY) >= 0 ?
        url.split(internals.ORIGIN_KEY)[1].split(/&|&amp;/gmi)[0].replace(/^=/, '') : '';
};

/*  */
internals.postMessage = function(targetOrigin, targetWindow, prefix) {
    prefix = utility.isString(prefix) ? prefix : internals.PREFIX;
    // targetOrigin implementation deviates in IE8, "*" not supported
    if (!targetOrigin || targetOrigin === '*') {
        targetOrigin = getOriginFromUrl(window.location.toString());
        if (!targetOrigin) {
            return;
        }
    }
    // default to parent window (TODO: parent or window.top)
    targetWindow = targetWindow || window.top;

    var res;
    if (support.hasCrossDomainFrameSupport()) {
        res = function(msg) {
            try {
                msg = prefix + JSON.stringify(msg || '');
                targetWindow.postMessage(msg, targetOrigin);
            } catch (e) {
                if (global.console) {
                    global.console.error(e);
                }
            }
        };
    } else {
        try {
            res = targetWindow[prefix + internals.GLOBAL_POSTMESSAGE_FALLBACK];
        } catch (e) {
            if (global.console) {
                global.console.error(e);
            }
        }
    }

    return res;
};

/* Handle incomming messages */
internals.incomming = function(cb, prefix, deactivateCDFS) {
    if (!utility.isFunction(cb)) {
        throw new Error('Missing callback');
    }
    prefix = prefix || internals.PREFIX;

    if (support.hasCrossDomainFrameSupport(deactivateCDFS)) {
        // must use document and not window to support IE8
        // todo... document not working o nchrome
        utility.on('message', global, function(e) {
            var res = e.data;
            if (res && utility.isString(res) && res.indexOf(prefix) === 0) {
                try {
                    var input = res.substring(prefix.length);
                    res = JSON.parse(input);
                } catch (err) {}
                cb(res, e.source, e.origin);
            }
        });
    } else {
        global[prefix + internals.GLOBAL_POSTMESSAGE_FALLBACK] = cb;
    }
};

internals.createOutgoing = function(origin, targetWindow, prefix) {
    return internals.postMessage(origin, targetWindow, prefix || internals.PARENT_PREFIX);
};

/*
    Be sure to talk to manager in the most parent iframe.
*/
internals.createManagerConnection = function(origin, prefix) {
    return internals.createOutgoing(origin, global.parent || global.top, prefix);
};

var RE_SPLIT = /&/gm;
internals.getHash = function(hash) {
    var args = (hash||global.location.hash).split('_|_');
    if (args[0] !== '#' + internals.PREFIX) {
        throw new Error('Missing #'+internals.PREFIX);
    }

    return {
        name: args[1],
        internal: paramUtil.deparam(args[2], RE_SPLIT),
        params: paramUtil.deparam(args[3], RE_SPLIT)
    };
};

module.exports = internals;
