var util = require('util');
var base = require('./karma.base.js');

module.exports = function (karma) {
    return karma.set(base(karma));
};
