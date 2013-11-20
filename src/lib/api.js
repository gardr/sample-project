/* jshint evil: true, maxparams:4 */
/*
    Banner Inframe api.

    Methods calling parent manager, which sets corresponding state.
*/
var logger = require('./log/logger.js');
var api = {};

var RE_EMPTY_PIX = /.*(1x1|3x3|1x2).*/i;

function hasEmptyPixel() {
    var result = false;
    var list = document.images;
    if (list && list.length > 0) {
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].src && list[i].src.match(RE_EMPTY_PIX)) {
                result = true;
            }
        }
    }
    return result;
}

api.init = function(input, com, getSizes, logOutput) {
    com = com || function() {};
    logOutput = logOutput || function () {};
    var banner;

    function readyHandler() {
        setTimeout(function() {
            // check for valid size
            if (banner.ignoreOnload === true) {
                banner.log.debug('ignoreOnLoad');
            } else if (hasEmptyPixel()) {
                banner.log.info('has empty pixel');
                com({
                    cmd: 'fail',
                    msg: 'pixel'
                });
            } else if (typeof getSizes === 'function') {
                var sizes = getSizes();
                banner.log.debug('responsive ' + sizes.r);
                banner.log.debug('width ' + sizes.w);
                banner.log.debug('height ' + sizes.h);
                com(sizes);
            }
        }, 1);
    }

    function applyCom(cmd, list) {
        return function() {
            var res = {
                cmd: cmd
            };

            var key;
            for (var i = 0; i < list.length; i++) {
                key = list[i];
                res[key] = arguments[i];
                if (key === 'cb' && typeof res[key] === 'function') {
                    res.index = banner._callbacks.push(res[key]) - 1;
                }
            }
            banner.log.debug('COM data for command \'' + res.cmd + '\': ' + JSON.stringify(res));
            return com(res);
        };
    }

    input.params = input.params || {};
    
    banner = {
        name: input.name,
        params: input.params,
        _internal: input.internal,

        //state
        ignoreOnload: false,

        start: function(url) {
            url = url || input.params.url || 'pastie_missing_script_url';
            if (!input.params.url && url) {
                input.params.url = url;
            }
            document.write(['<scr', 'ipt type="text/javascript" src="', url, '"></scr', 'ipt>'].join(''));
        },

        log: logger.create(input.name, input.params.loglevel, logOutput),
        resize: applyCom('resize', ['w', 'h']),
        resolve: applyCom('resolve', ['msg']),
        fail: applyCom('fail', ['msg']),
        setBannerFlag: applyCom('set', ['key', 'value', 'cb']),
        getBannerFlag: applyCom('get', ['msg', 'cb']),
        processSize: readyHandler,
        _callbacks: [],
        plugin: function(pluginName, options, cb) {
            return com({
                cmd: 'plugin',
                plugin: pluginName,
                options: options,
                index: banner._callbacks.push(cb) - 1
            });
        },
        callback: function(o) {
            if (typeof o.index === 'number' && typeof banner._callbacks[o.index] === 'function') {
                banner._callbacks[o.index](o.result, o);
                banner._callbacks[o.index] = null;
            }
        }
    };

    banner.log.debug('Banner init');

    // Banner iframe exposed api
    return banner;
};

module.exports = api;
