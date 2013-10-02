var util = require('./utility.js');
var paramUtil = require('./paramUtil.js');

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
                return scriptUrl + sep + paramUtil.param(inject, ';');
            }
        };
    }
    _url = scriptUrl.split(ADTECH_SPLIT);
    feed = paramUtil.deparam(_url[1]);

    return {
        inject: function(inject) {
            return _url[0] + ADTECH_SPLIT + paramUtil.param(util.extend({}, feed, inject), ';');
        },
        feedStr: _url[1],
        feed: feed
    };
}

module.exports = {
    extractFeed: extractFeed
};
