/* jshint camelcase: false */
module.exports = function(data) {
    data = data || window.FINN && window.FINN.data && window.FINN.data.banner || {};

    return function(cb) {
        var _data = data.data || {};
        var _params = data.params || {};

        var res = {
            ext_logger: data.ext_logger || 'true',
            keyvalues: data.keyvalues || '',
            data: _data,
            keywords: data.keywords || '',
            parameters: data.parameters || '',
            params: _params,
            score: data.score || '',
            segments: data.segments || ''
        };
        if (typeof cb === 'function') {
            cb(res);
        }
        return res;
    };
};
