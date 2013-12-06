/*
    iOS rAF requestAnimationFrame shim.

    Need to replace raf to get requestAnimationFrame to work in parent page.
*/
/* http://stackoverflow.com/questions/8348139/detect-ios-version-less-than-5-with-javascript */
function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }
}

function clearRaf(id) {
    clearTimeout(id);
}

function polyfillRaf(){
    var lastTime = 0;

    return function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(new Date().getTime());
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}

var natives = {};
function override(keys, overrideFn) {
    keys.forEach(function (key) {
        if (key in window) {
            natives[key] = window[key];
            window[key] = overrideFn;
        }
    });
}

function doPolyfill() {
    var raf = polyfillRaf();
    override(['webkitRequestAnimationFrame', 'requestAnimationFrame'], raf);
    override(['webkitCancelAnimationFrame', 'webkitCancelRequestAnimationFrame',
        'cancelRequestAnimationFrame', 'cancelAnimationFrame'], clearRaf);
}

module.exports = function (force) {
    var ver = iOSversion();
    var ios = ver && ver[0] < 7;
    if (ios || force){
        doPolyfill();
    }
};

module.exports._reset = function () {
    for(var key in natives) {
        window[key] = natives[key];
    }
};