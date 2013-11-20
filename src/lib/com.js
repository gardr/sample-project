var utility = require('./utility.js');
var paramUtil = require('./paramUtil.js');
var support = require('./support.js');
/*
    Communication from and to banner container
*/
var com = {};

com.PREFIX = 'PASTIES';
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
    prefix = utility.isString(prefix) ? prefix : com.PREFIX;
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
            res = targetWindow[prefix + com.GLOBAL_POSTMESSAGE_FALLBACK];
        } catch (e) {
            if (global.console) {
                global.console.error(e);
            }
        }
    }

    return res;
};

/* Handle incomming messages */
com.incomming = function(cb, prefix, deactivateCDFS) {
    if (!utility.isFunction(cb)) {
        throw new Error('Missing callback');
    }
    prefix = prefix || com.PREFIX;

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
        global[prefix + com.GLOBAL_POSTMESSAGE_FALLBACK] = cb;
    }
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

var RE_SPLIT = /&/gm;
com.getHash = function(hash) {
    var args = (hash||global.location.hash).split('_|_');
    if (args[0] !== '#' + com.PREFIX) {
        throw new Error('Missing #'+com.PREFIX);
    }

    return {
        name: args[1],
        internal: paramUtil.deparam(args[2], RE_SPLIT),
        params: paramUtil.deparam(args[3], RE_SPLIT)
    };
};

module.exports = com;
