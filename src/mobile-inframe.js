var utility     = require('./lib/utility.js');
var paramUtil   = require('./lib/paramUtil.js');
var api         = require('./lib/api.js');
var com         = require('./lib/com.js');
var getSize     = require('./lib/size.js');
var insertCss   = require('./lib/style/insertCss.js');
var responsive  = require('./lib/responsive.js');
var support     = require('./lib/support.js');
var plugin      = require('./lib/plugins/contextData.js');
var rAFPatch    = require('./lib/raf.js');
var feed        = require('./lib/feed.js');
//var hashData    = require('./lib/hashData');

/*
    Mobile inframe.
    * fetch setupdata (parentUrl, level) from query/hash
*/
var input = com.getHash();
//var input = hashData.decode(global.location.hash);

if (input.params.cdfs === 'true'){
    global[support.cdfsKey] = true;
}

// patch or polifill request animation frame
var ver = support.iOSversion();
var ios = ver && ver[0] < 7;
if (ios){
    rAFPatch();
}

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
            keyvalues: paramUtil.param(keyvalues, ';'),
            data: keyvalues
        })(cb);
    }
    o.name = input.name;
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
    //parent.console.log('incomming msg', internals.name, msg);
    if (msg.cmd === 'callback' && utility.isNumber(msg.index)) {
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

utility.on('load', global, internals.processSize);

module.exports = internals;
