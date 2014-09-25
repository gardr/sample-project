# Garðr sample project

[![Build Status](https://api.travis-ci.org/gardr/sample-project.png?branch=master)](https://travis-ci.org/gardr/sample-project)
[![Dependency Status](https://david-dm.org/gardr/sample-project.png)](https://david-dm.org/gardr/sample-project)
[![devDependency Status](https://david-dm.org/gardr/sample-project/dev-status.png)](https://david-dm.org/gardr/sample-project#info=devDependencies)


This is a sample project to show how you can use Garðr on your site. Garðr is a library for embedding content from
external scripts such as advertisements or similar third party content.

This repo (gardr/gardr) is just a sample project on how to use the Garðr client libraries;
[gardr-host](https://github.com/gardr/host/) and [gardr-ext](https://github.com/gardr/ext/). You can have them as
dependencies from npm, and just require them into your project. That makes it possible to make custom bundles with only
the plugins you need. If you don't use CommonJS it's easy to convert to AMD or a global instead.


## Pre-requisits
* [NodeJS + NPM](http://nodejs.org)

## Running the samples

    $ git clone git@github.com:gardr/sample-project.git
    $ cd sample-project/
  	$ npm install
  	$ npm start

* Open browser [http://localhost:9966/](http://localhost:9966/)


## How things fit together

Have a look in the `src/` folder. There you will find the example bundles (packages) that you will have to make for
your site. `hostBundle.js` is the script you will put on your page. `extBundle.js` is what goes into the iframe.

The files the `src/` folder are in CommonJS style. Which is typically used server-side, but can also be used for client-
side code. Use `require` to import dependencies (gardr-host, gardr-ext and plugins). We use
[browserify](https://www.npmjs.org/package/browserify) to convert these files to browser-friendly JavaScript. Try
running `npm run browserify`, and you will find the generated scripts in the `gardr/` folder. See the `browserify`
script in package.json for the command we use to run browserify.

Since we use the -s (standalone) option to browserify, it will wrap the output as UMD (Universal Module Definition). It
allows you to use the generated files with CommonJS, AMD or just vanilla JavaScript.

    // CommonJS
    var gardrHost = require('gardr/host.js');

    // AMD
    define(['gardr/host.js'], function (gardrHost) {
        ...
    });

    // Vanilla JS
    window.gardrHost

The sample page is just a static html-file (public/index.html). It has a simple script to load the sample banners which
use the Vanilla JS style (window.gardrHost).


## Testing

We have many tests inside the gardr-host and gardr-ext projects. This is just a simple test to verify that they work
together.

	$ npm test
