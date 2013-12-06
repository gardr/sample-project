var queryParams = require('query-params');
var api         = require('./lib/api.js');
var com         = require('./lib/com.js');
var getSize     = require('./lib/size.js');
var insertCss   = require('./lib/style/insertCss.js');
var responsive  = require('./lib/responsive.js');
var plugin      = require('./lib/plugins/contextData.js');
var rafPolyfill = require('./lib/rafPolyfill.js');
var feed        = require('./lib/feed.js');
var hashData    = require('./lib/hashData.js');

/*
    Mobile inframe.
    * fetch setupdata (parentUrl, level) from query/hash
*/
var input = hashData.decode(window.location.hash);

// patch or polifill request animation frame
rafPolyfill();

var _comParent = com.createManagerConnection(input.internal.origin, input.internal.key);

var feeder = feed.extractFeed(input.params.url);
var keyvalues = {
    kvuserid: input.params.kvuserid,
    kvuserareaid: input.params.kvuserareaid
};

// inject extra keyvalues
input.params.url = feeder.inject(keyvalues);

// Intercept communication to parent manager and check for contextData "plugin".
var comParent = function(o, cb) {
    if (o.cmd === 'plugin' && o.plugin === 'contextData') {
        return plugin({
            parameters: feeder.feedStr,
            params: feeder.feed,
            keyvalues: queryParams.encode(keyvalues, ';'),
            data: keyvalues
        })(cb);
    }
    o.id = input.id;
    return _comParent(o);
};

var logAppender = require('./lib/log/getAppender.js')(input.params.logto);
var internals = global.banner = api.init(input, comParent, getSizes, logAppender);

/*
    Handle incomming commands
    * resolve callbacks
    * check for sizes
*/
com.incomming(function(msg) {
    //parent.console.log('incomming msg', internals.id, msg);
    if (msg.cmd === 'callback' && typeof msg.index == 'number') {
        internals.callback(msg);
    } else if (msg.cmd === 'getSizes') {
        internals.processSize();
    }
});

function getSizes() {
    var elem = document.getElementById(com.PREFIX);
    var size = getSize(elem);
    var isResponsive = true;

    insertCss( responsive.getCSS(isResponsive) );
    
    return {
        cmd: 'sizes',
        r: isResponsive,
        w: size.width,
        h: size.height
    };
}

global.addEventListener('load', internals.processSize, false);

module.exports = internals;
