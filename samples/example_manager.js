var manager = require('../src/mobile.js')();
var util = require('../src/lib/utility.js');
//console.log((+new Date+'').substring(8), 'example_manager.js');

util.on('load', window, function () {
    //console.log((+new Date+'').substring(8), 'example_manager.js load');

    function getStuff(i) {
        return {
            name: 'example_responsive' + i,
            url: '/example_content_responsive.js',
            width: 900,
            height: 225,
            container: 'pasties_container'
        };
    }

    var body = document.getElementsByTagName('body')[0];
    if (body) {
        var container = document.createElement('div');
        container.id = 'pasties_container';
        body.appendChild(container);

        manager.options = {
            iframeUrl: 'http://127.0.0.1:9966/html/pasties/example.htm',
            sameDomainIframeUrl: '/html/pasties/example.htm'
        };

        if (window.bannerUrl) {
            manager.queue({
                name: 'banner',
                url: bannerUrl,
                done: function (err, item) {
                    console.log((+new Date()+'').substring(8), 'banner DONE', err, item);
                },
                container: 'pasties_container'
            });
            manager.renderAll();
            return;
        }

        manager.queue({
            name: 'example',
            url: '/example_content.js?misc=PASTIES_UNIQUE_ID',
            //width: 500,
            //height: 200,
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
            container: 'pasties_container'

        });

        manager.queue([
            {
                name: 'writes',
                url: '/example_write1.js?misc=PASTIES_UNIQUE_ID',
                width: 100,
                height: 25,
                container: 'pasties_container'
            },
            getStuff('1'),
            getStuff('2'),
            {
                name: 'example2',
                url: '/example_content.js?misc=PASTIES_UNIQUE_ID',
                width: 300,
                height: 225,
                container: 'pasties_container'
            },
            {
                name: 'responsive_alterniatve',
                url: '/example_relative_container.js',
                width: 500,
                height: 1,
                container: 'pasties_container',
                ignoreResize: false
            },
            {
                name: 'responsive_alt2',
                url: '/example_relative_container.js',
                width: 100,
                height: 100,
                container: 'pasties_container',
                ignoreResize: false
            },
            {
                name: 'failing',
                url: '/example_scripterror_pre.js',
                width: 100,
                height: 100,
                container: 'pasties_container',
                ignoreResize: false
            },
            getStuff('3'),
            getStuff('4'),
            getStuff('5'),
            getStuff('7'),
            getStuff('8'),
            getStuff('9'),
            getStuff('10')
        ]);

        manager.queue({
            name: 'example3',
            url: '/example_content.js',
            width: 900,
            height: 100,
            container: 'pasties_container'
        });

        manager.render('example', function (err, item) {
            console.log((+new Date()+'').substring(8), 'example DONE', item);

            manager.renderAll('writes,example2,example3', function (err, items) {
                console.log((+new Date()+'').substring(8), 'ALL DONE', items);

            });
        });

    }

});
