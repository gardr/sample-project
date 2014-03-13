# Garðr - the safe way to add third party content to your site

[![Build Status](https://api.travis-ci.org/gardr/gardr.png?branch=master)](https://travis-ci.org/gardr/gardr)
[![NPM](https://nodei.co/npm/gardr.png?stars=true&downloads=true)](https://npmjs.org/package/gardr)

Garðr is a library for embedding content from external sources such as advertisements or similar third party content.

This repo (gardr/gardr) is just a sample project on how to use the Garðr client libraries;
gardr-host](https://github.com/gardr/host/) and [gardr-ext](https://github.com/gardr/ext/). You can have them as
dependencies from npm, and just require them into your project. That makes it possible to make custom bundles with only
the plugins you need. If you don't use CommonJS it's easy to convert to AMD or a global instead.

Removes the need for friendly iframes support in delivery systems and supports both HTML, Image and Flash based adverts.
The iframe should be hosted on a different domain to enable security-features in the browser that prevents third party
content to insert content or get user info from the parent page. postMessage is used for cross-domain communication
between the frames.

## Pre-requisits
* [NodeJS + NPM](http://nodejs.org)

# Running the samples

	$ npm install
	$ npm start

* Open browser [http://localhost:9966/example.html](http://localhost:9966/example.html)

## Building bundles

	$ npm run browserify

Will run the `browserify` task from package.json, and generate a browser-version of the files in /lib.

## Testing
Easiest way is through npm.

	$ npm test

# Debugging

## Logging

Debugging can be done by configuring logging to either the browser console or as an overlay inside the iframes rendered
by Garðr.

You can turn on logging by adding an url-fragment with log level: #loglevel=4
By default it will display an overlay inside each banner with the log output. If the banner isn't visible, you can
output to console by using: #loglevel=4&logto=console

*NB!* If the banner injects another iframe we have no good way of catching errors :(


## Polyfills required for IE8+ support

* [ES5-shim](https://npmjs.org/package/es5-shim) You do not need a sham (unsafe polyfills).
* postMessage is required, so it won't work in IE7 at the moment.

## Samples in the wild

* All of the display adverts on [m.finn.no](http://m.finn.no/) is using Garðr to safely embed responsive adverts written
in HTML, CSS and JS.
