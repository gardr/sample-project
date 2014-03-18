/*eslint no-console:0*/
/*global gardrHost:false*/

(function (gardrHost, win) {
    function callback (err, item) {
        var status = (err ? 'fail' : 'done');

        if (item && item.rendered.height < 10) {
            var container = item.options.container, seconds = 5;
            container.innerHTML = 'Detected size: ' +
                item.rendered.width + '×' + item.rendered.height + '. ' +
                'Collapsing banner in ' + seconds + ' seconds...';

            setTimeout(function countDown() {
                seconds--;
                container.innerHTML = container.innerHTML.replace(/\d seconds/, function () {
                    return [seconds, ' second', (seconds > 1 ? 's' : '')].join('');
                });
                if (seconds > 0) {
                    setTimeout(countDown, 1000);
                }
            }, 1000);

            setTimeout(function () {
                container.style.display = 'none';
                container.previousElementSibling.innerHTML += ' (auto-collapsed)';
            }, seconds * 1000);
        }
        console.log((new Date().getTime() + '').substring(8), item.name + ' ' + status, err, item);
    }

    function onLoad () {

        var gardr = gardrHost({
            iframeUrl: 'http://10.0.2.2:9966/gardr-ext/iframe.html', // cross-domain
            extScriptUrl: '/browserified/extBundle.js'
        });

        gardr.queue('banner1', {
            url: '/banners/animation/index.js',
            height: 225,
            container: 'banner1'
        });

        gardr.queue('1px',{
            url: '/banners/1px/index.js',
            height: 225,
            container: '1px'
        });

        gardr.renderAll(callback);

    }

    if (win.addEventListener) {
        win.addEventListener('DOMContentLoaded', onLoad, false);
    } else if (win.attachEvent) {
        win.attachEvent('onload', onLoad);
    }
})(gardrHost, window);
