var util = require('./utility.js');
var queryParams = require('query-params');

var ADTECH_SPLIT = '|ADTECH;';

// TODO this needs to be generalized

function extractFeed(scriptUrl) {

    var _url, feed;
    if (scriptUrl.indexOf(ADTECH_SPLIT) === -1) {
        return {
            feed: '',
            feedStr: '',
            inject: function(inject) {
                var sep = scriptUrl.indexOf('?') === -1 ? '?' : '&';
                return scriptUrl + sep + queryParams.encode(inject, ';');
            }
        };
    }
    _url = scriptUrl.split(ADTECH_SPLIT);
    feed = queryParams.decode(_url[1]);

    return {
        inject: function(inject) {
            return _url[0] + ADTECH_SPLIT + queryParams.encode(util.extend({}, feed, inject), ';');
        },
        feedStr: _url[1],
        feed: feed
    };
}

module.exports = {
    extractFeed: extractFeed
};
