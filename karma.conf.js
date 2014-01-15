var util = require('util');
var base = require('./test/karma.base.js');

module.exports = function (karma) {
    return karma.set(base(karma));
};
