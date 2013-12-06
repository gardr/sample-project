var getCookies = require('./lib/usercookies.js').getCookies;
var Manager = require('./lib/manager.js');
/*

    Special cases:
        collect userid/USERID from cookie and pass into frame.
            append to scripturl

*/
function getManager(options) {
    if(typeof options === 'string'){
        options = {
            iframeUrl: options
        };
    } else if (!options) {
        options = {};
    }
    options.urlFragment = window.location.hash;

    var manager = new Manager(options);

    manager.extendInframeData(getCookies());

    // expose for debugging
    global.__pman = manager;

    return manager;
}


module.exports = getManager;
global.getManager = global.gardrHack = getManager;
