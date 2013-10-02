# pasties-js

Pasties is a library for embedding content from external sources such as advertisements or similar third party content. 

[![Build Status](https://travis-ci.org/pasties/pasties-js.png)](https://travis-ci.org/pasties/pasties-js)

## Config

We put bower modules inside node_modules folder so it just works. It's not optimal, but works for now.

# Build 

## Pre-requisits
* [NodeJS + NPM](http://nodejs.org)
* [grunt](http://gruntjs.com/)

## Building a distribution

	$ npm install
	$ grunt --force

## Testing
Easiest way is through npm.

	$ npm test

When working with the code you can use karma and grunt to get continuous feedback on your tests.

	$ grunt karam:watch

	or

	$ karma start


# Releasing new versions
This task releases a new version to the Maven repository. 

	# Trigger the Maven release plugin
	$ grunt release
	
	# Make sure you push the commits made by the release plugin
	$ git push	

	# Push the tags for the release
	$ git push --tags

# Demos and samples

There are some examples on how to use pasties located in the samples [folder](./folder).
* Run the following commands to install the samples applciation

	$ cd samples/
	$ npm install
	$ node app.js

* Open browser [http://localhost:9966/example.html](http://localhost:9966/example.html)

# Logging

You can turn on logging by adding an url-fragment with log level: #loglevel=4
By default it will display an overlay inside each banner with the log output. If the banner isn't visible, you can output to console by using: #loglevel=4&logto=console
NB! If the banner injects another iframe we have no good way of catching errors :(
