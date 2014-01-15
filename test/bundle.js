var browserify  = require('browserify');
var pathLib     = require('path');

var preprocessor = function (logger, config) {
    var log = logger.create('preprocessor.bundle');
    log.debug('config', config);
    return function (content, file, done) {
        log.debug('Processing "%s".', file.originalPath);

        var path = pathLib.normalize(file.originalPath);
        var b = browserify(path);

        return b.bundle({'debug': true, 'entry': false}, function (err, fileContent) {
            return done(fileContent);
        });
    };
};

preprocessor.$inject = ['logger', 'config.bundle'];

module.exports = {
    'preprocessor:bundle': ['factory', preprocessor],
};
