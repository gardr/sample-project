var queryParams   = require('query-params');
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

    var pParams     = queryParams.decode(_url[1], /&/gmi);
    var obj         = extractFeed(pParams.url);
    var keyvalues   = getCookies();

    obj.feed.url    = obj.inject(keyvalues);

    return {
        input: pParams,
        parameters: queryParams.encode(obj.feed, ';'),
        params: obj.feed,
        keyvalues: queryParams.encode(keyvalues, ';'),
        data: keyvalues
    };
}

module.exports = {
    parseParentUrl: parseParentUrl
};
