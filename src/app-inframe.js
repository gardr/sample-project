/*
    App.js

    Expose same api as web and mobile browser to ios and android webview.
    There is no manager.
*/
var plugin      = require('./lib/plugins/contextData.js');
var api         = require('./lib/api.js');
var parsed      = require('./lib/app-collector.js').parseParentUrl(document.location.toString());
var getSize     = require('./lib/size.js');
var insertCss   = require('./lib/style/insertCss.js');
var responsive  = require('./lib/responsive.js');

module.exports = window.banner = api.init({
    name: parsed.params.alias,
    params: parsed.params
}, function(o, cb) {
    // ignore all except contextData
    if (o.cmd === 'plugin' && o.plugin === 'contextData') {
        return plugin(parsed)(cb);
    }
}, function(){
    // getsizes -> inject CSS
    var resp = responsive.isResponsive(getSize(document.getElementById('GARDR')));
    insertCss( responsive.getCSS(resp) );
});
