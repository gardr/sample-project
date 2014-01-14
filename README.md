# Garðr - the safe way to add third party content to your site

[![Build Status](https://travis-ci.org/gardr/gardr.png)](https://travis-ci.org/gardr/gardr)
[![Coverage Status](https://coveralls.io/repos/gardr/gardr/badge.png)](https://coveralls.io/r/gardr/gardr)
[![NPM version](https://badge.fury.io/js/gardr.png)](http://badge.fury.io/js/gardr)
[![Dependency Status](https://david-dm.org/gardr/gardr.png)](https://david-dm.org/gardr/gardr)
[![devDependency Status](https://david-dm.org/gardr/gardr/dev-status.png)](https://david-dm.org/gardr/gardr#info=devDependencies)

[![NPM](https://nodei.co/npm/gardr.png?stars=true&downloads=true)](https://npmjs.org/package/gardr)

Garðr is a library for embedding content from external sources such as advertisements or similar third party content.

Removes the need for friendly iframes support in delivery systems and supports both HTML, Image and Flash based adverts. The iframe should be hosted on a different domain to enable security-features in the browser that prevents third party content to insert content or get user info from the parent page. postMessage is used for cross-domain communication.

# Installation
We're working on making Garðr a real npm-package you can just require into you project, but for now you have to build from the git repo.

	$ npm install gardr


# Building

## Pre-requisits
* [NodeJS + NPM](http://nodejs.org)
* [grunt](http://gruntjs.com/)

## Building a distribution

	$ cd node_modules/gardr
	$ npm install
	$ grunt

## Testing
Easiest way is through npm.

	$ npm test

When working with the code you can use karma and grunt to get continuous feedback on your tests.

	$ grunt karam:watch

	or

	$ karma start

## Config

We put bower modules inside node_modules folder so it just works. It's not optimal, but works for now.

# Debugging

## Logging

Debugging can be done by configuring logging to either the browser console or as an overlay inside the iframes rendered by Garðr.

You can turn on logging by adding an url-fragment with log level: #loglevel=4
By default it will display an overlay inside each banner with the log output. If the banner isn't visible, you can output to console by using: #loglevel=4&logto=console

*NB!* If the banner injects another iframe we have no good way of catching errors :(


## Polyfills required for IE8+ support

* [ES5-shim](https://npmjs.org/package/es5-shim) You do not need a sham (unsafe polyfills).
* [addEventListener polyfill](https://gist.github.com/eirikbacker/2864711/dcc32b15ea79f8f364ca1707f81ec74a15fa25db)
* postMessage is required, so it won't work in IE7 at the moment. This is possible to solve if there is a demand for it.

# Releasing new versions
(Sorry this is specific to FINN, we're working on re-structure the project to avoid having this inside Garðr)
This task releases a new version to the Maven repository.

	# Trigger the Maven release plugin
	$ grunt release

	# Make sure you push the commits made by the release plugin
	$ git push

	# Push the tags for the release
	$ git push --tags

# Demos and samples

There are some examples on how to use Garðr located in the samples [folder](./samples).
* Run the following commands to install the samples applciation

	$ cd samples/
	$ npm install
	$ node app.js

* Open browser [http://localhost:9966/example.html](http://localhost:9966/example.html)

## Samples in the wild

* All of the display adverst on [m.finn.no](http://m.finn.no/) is using Garðr to safely embed responsive adverts written in HTML, CSS and JS.
