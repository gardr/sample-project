var paramUtil   = require('./paramUtil.js');
var getCookies  = require('./usercookies.js').getCookies;
var extractFeed = require('./feed.js').extractFeed;
/*
    App-collector. specific file for in-webview-banner-api

    parse and collect
    add userId cookie script url.
*/

function parseParentUrl(url) {
    var _url = url.split('?');
    if (!_url[1]) {
        return {
            params: {},
            data: {}
        };
    }

    var pParams     = paramUtil.deparam(_url[1], /&/gmi);
    var obj         = extractFeed(pParams.url);
    var keyvalues   = getCookies();

    obj.feed.url    = obj.inject(keyvalues);

    return {
        input: pParams,
        parameters: paramUtil.param(obj.feed, ';'),
        params: obj.feed,
        keyvalues: paramUtil.param(keyvalues, ';'),
        data: keyvalues
    };
}

module.exports = {
    parseParentUrl: parseParentUrl
};
