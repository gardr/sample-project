# Garðr sample project

This is a sample project to show how you can use Garðr on your site. Garðr is a library for embedding content from
external scripts such as advertisements or similar third party content.

This repo (gardr/gardr) is just a sample project on how to use the Garðr client libraries;
[gardr-host](https://github.com/gardr/host/) and [gardr-ext](https://github.com/gardr/ext/). You can have them as
dependencies from npm, and just require them into your project. That makes it possible to make custom bundles with only
the plugins you need. If you don't use CommonJS it's easy to convert to AMD or a global instead.


## Pre-requisits
* [NodeJS + NPM](http://nodejs.org)

## Running the samples

    $ git clone git@github.com:gardr/gardr.git
    $ cd gardr/
  	$ npm install
  	$ npm start

* Open browser [http://localhost:9966/](http://localhost:9966/)


# Other info

## Testing

	$ npm test


