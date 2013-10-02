/* http://stackoverflow.com/questions/8348139/detect-ios-version-less-than-5-with-javascript */
function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }
}

var realSupport = 'postMessage' in window && 'JSON' in window;
var cdfsKey = '__DEACTIVATE_CDFS';
module.exports = {
    // todo, need test-runs that run this as false
    crossDomainFrameSupport: realSupport,
    iOSversion: iOSversion,
    cdfsKey: cdfsKey,
    hasCrossDomainFrameSupport: function (force) {
        return force !== true && global[cdfsKey] !== true && realSupport;
    }
};
