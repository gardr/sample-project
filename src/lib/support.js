var realSupport = 'postMessage' in window && 'JSON' in window;
var cdfsKey = '__DEACTIVATE_CDFS';
module.exports = {
    // todo, need test-runs that run this as false
    crossDomainFrameSupport: realSupport,
    cdfsKey: cdfsKey,
    hasCrossDomainFrameSupport: function (force) {
        return force !== true && global[cdfsKey] !== true && realSupport;
    }
};
