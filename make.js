#!/usr/bin/env node
require('shelljs/make');
var path = require('path');

// Replace / with \ on windows
function platformPath(p) {
    return p.split('/').join(path.sep);
}

// Create a browser-friendly bundle with Browserify
function makeBundle (moduleName, srcFile, destFile) {
    var cmd = [
        // path to the browserify binary
        platformPath('./node_modules/.bin/browserify'),

        // Make it a UMD bundle with specified name (CommonJS, AMD or global)
        '-s', moduleName,

        // main source file
        srcFile,

        // bundle file destination
        '-o', destFile
    ].join(' ');
    echo('Creating bundle \'' + moduleName + '\' ('+destFile+')');
    exec(cmd);
}

target.clean = function () {
    rm('-rf', 'gardr');
};

target.bundle = function () {
    mkdir('-p', 'gardr')
    makeBundle('gardrHost', 'src/hostBundle.js', 'gardr/host.js');
    makeBundle('gardrExt', 'src/extBundle.js', 'gardr/ext.js');

    echo('Copying iframe.html to gardr/');
    cp('-f', './node_modules/gardr-ext/iframe.html', 'gardr');
};

target.start = function () {
    target.bundle();
    exec('node app.js');
};

target.test = function () {
    target.bundle();
    exec(platformPath('./node_modules/karma/bin/karma') + ' start --single-run');
};
