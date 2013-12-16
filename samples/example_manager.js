var manager = require('../src/mobile.js')();
var eventListener = require('eventlistener');
//console.log((+new Date+'').substring(8), 'example_manager.js');

eventListener.add(window, 'load', function () {
    //console.log((+new Date+'').substring(8), 'example_manager.js load');

    function getStuff() {
        return {
            url: '/example_content_responsive.js',
            width: 900,
            height: 225,
            container: 'gardr_container'
        };
    }

    var body = document.getElementsByTagName('body')[0];
    if (body) {
        var container = document.createElement('div');
        container.id = 'gardr_container';
        body.appendChild(container);

        manager.options = {
            iframeUrl: 'http://127.0.0.1:9966/html/gardr/example.htm',
            sameDomainIframeUrl: '/html/gardr/example.htm'
        };

        if (window.bannerUrl) {
            manager.queue('banner', {
                url: bannerUrl,
                done: function (err, item) {
                    console.log((+new Date()+'').substring(8), 'banner DONE', err, item);
                },
                container: 'gardr_container'
            });
            manager.renderAll();
            return;
        }

        manager.queue('example', {
            url: '/example_content.js?misc=GARDR_UNIQUE_ID',
            width: 250,
            height: 137,
            // threshold:
            // before:
            // done:
            // fail
            // after:
            // track
            // extends
            done: function(err, item){
                console.log((+new Date()+'').substring(8), 'example DONE', err, item);

            },
            container: 'gardr_container'

        });

        manager.queue('writes',
            {
                url: '/example_write1.js?misc=GARDR_UNIQUE_ID',
                width: 250,
                height: 137,
                container: 'gardr_container'
            });
        manager.queue('example_responsive1', getStuff());
        manager.queue('example_responsive2',getStuff());
        manager.queue('example2',
        {
            url: '/example_content.js?misc=GARDR_UNIQUE_ID',
            width: 250,
            height: 137,
            container: 'gardr_container'
        });
        manager.queue('responsive_alterniatve',
            {
                url: '/example_relative_container.js',
                width: 250,
                height: 137,
                container: 'gardr_container',
                ignoreResize: false
            });
        manager.queue('responsive_alt2',
            {
                url: '/example_relative_container.js',
                width: 250,
                height: 137,
                container: 'gardr_container',
                ignoreResize: false
            });
        manager.queue('failing',
            {
                url: '/example_scripterror_pre.js',
                width: 250,
                height: 137,
                container: 'gardr_container',
                ignoreResize: false
            });
        manager.queue('example_responsive3', getStuff());
        manager.queue('example_responsive4', getStuff());
        manager.queue('example_responsive5', getStuff());
        manager.queue('example_responsive6', getStuff());
        manager.queue('example_responsive8', getStuff());
        manager.queue('example_responsive9', getStuff());
        manager.queue('example_responsive10', getStuff());

        manager.queue('example3', {
            url: '/example_content.js',
            width: 250,
            height: 137,
            container: 'gardr_container'
        });

        manager.render('example', function (err, item) {
            console.log((+new Date()+'').substring(8), 'example DONE', item);

            manager.renderAll('writes,example2,example3', function (err, items) {
                console.log((+new Date()+'').substring(8), 'ALL DONE', items);
            });
        });

    }

}, false);
