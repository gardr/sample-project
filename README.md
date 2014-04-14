# Garðr - protecting your site from third party content

This is a sample project to show how you can use Garðr on your site. Garðr is a library for embedding content from
external scripts such as advertisements or similar third party content.

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

## Running the samples

    $ git clone git@github.com:gardr/gardr.git
    $ cd gardr/
  	$ npm install
  	$ npm start

* Open browser [http://localhost:9966/](http://localhost:9966/)

# Use in your project

## Add dependencies
**package.json**

If you don't have a package.json

    $ npm init

Install dependencies (into node_modules and as dependency in package.json)

    $ npm install --save gardr-host gardr-ext

If you need plugins install them the same way as above

## Building bundles
Take a look at the `browserify` task from package.json. It uses browserify to generate a static browser-version of the
files in /lib.

	$ npm run browserify

[Browserify](https://github.com/substack/node-browserify) is a tool to convert CommonJS modules to browser-friendly
JavaScript. You can choose to make your own bunles using CommonJS, or transform it to an
[UMD](https://github.com/umdjs/umd) module using the `--standalone` (or `-s`) argument. Then you can load it with an AMD
loader or `window.gardrHost`.

	$ browserify -s gardrHost lib/hostBundle.js > browserified/hostBundle.js

If you want source maps to make debuggin the code easier, add `--debug` as browserify argument. Browserify only adds
source maps as an inline comment. So if you want and external source map, use
[exorcist](https://github.com/thlorenz/exorcist) to extract it:

	$ browserify lib/hostBundle.js --debug | exorcist browserified/hostBundle.js.map > browserified/hostBundle.js

# Other info

## Testing

	$ npm test

## Logging

Debugging can be done by configuring logging to either the browser console or as an overlay inside the iframes rendered
by Garðr.

You can turn on logging by adding an url-fragment with log level: #loglevel=4
By default it will display an overlay inside each banner with the log output. If the banner isn't visible, you can
output to console by using: #loglevel=4&logto=console

*NB!* If the banner injects another iframe we have no good way of catching errors :(

## No support for IE7 or older

We have very few IE7 users, and some of the techniques used in Garðr (like postMessage) require many dirty hacks to
work in IE7.

## Polyfills required for IE8+ support

To keep the code minimal for modern browsers (mobile), we use some new features that came in EcmaScript 5. They are easy
to implement in older browsers using a few simple polyfills. You can include it with a conditional-comment, so only
users with old IE versions download the extra script. See the iframe html for an example.
* [ES5-shim](https://npmjs.org/package/es5-shim) You do not need a sham (unsafe polyfills).

## Samples in the wild

* All of the display adverts on [m.finn.no](http://m.finn.no/) are using Garðr to safely embed responsive adverts
written in HTML, CSS and JS.
