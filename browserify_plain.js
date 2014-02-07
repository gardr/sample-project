/*
  Temp file for serving plain browserify modules because karma-browserify only works in 1 scope.
  should get a PR into karma-browserify to ignore common bundle.
*/

var browserify = require('browserify');
var pathLib = require('path');

var preprocessor = function(logger, config) {
  var log = logger.create('preprocessor.browserify_plain');
  log.debug('config', config);
  return function(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);

    var fileBundle = browserify(pathLib.normalize(file.originalPath));    

    return fileBundle.bundle({ debug: true }, function(err, fileContent) {
        return done(fileContent);
    });
  };
};

preprocessor.$inject = ['logger', 'config.browserify_plain'];

module.exports = {
  'preprocessor:browserify_plain': ['factory', preprocessor],
};
