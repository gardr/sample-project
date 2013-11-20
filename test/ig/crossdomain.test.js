var helpers = require('../testHelpers.js');
var Manager = require('../../src/lib/manager.js');
var support = require('../../src/lib/support.js');

var iframeSrc = '/base/test/fixtures/iframe.html';

function getPort(port) {
    return port ? ':' + port : '';
}

describe('Cross domain iframe test', function () {

    it('should resolve cross domain', function () {

        var base = '//127.0.0.1';

        var manager = new Manager({
            iframeUrl: base + getPort(document.location.port) + iframeSrc,
            sameDomainIframeUrl: iframeSrc
        });

        var name = 'cross_domain_test';
        var id = 'container_' + name;
        var done = false;

        var body = document.getElementsByTagName('body')[0];
        var container = document.createElement('div');

        container.id = id;
        body.appendChild(container);

        manager.queue({
            name: name,
            container: id,
            url: '/base/test/fixtures/config_content.js',
            width: 123,
            height: 321,
            done: function (err, item) {
                expect(err).toBeUndefined();
                expect(item).toBeDefined();

                if (item.input.height === 0) {
                    console.debug('crossdomain.test.js failed test 1: debug info', item);
                    if (item.com) {
                        //TODO:
                        console.log('re-checking');
                        item.com({
                            cmd: 'getSizes'
                        });
                    }
                } else {
                    done = true;
                }

                expect(item.input.width).toEqual(123);
                expect(item.input.height).toEqual(321);
                var src = item.iframe.iframe.getAttribute('src');

                // as this will test in not usable browsers, we need to asure result

                if (support.crossDomainFrameSupport)  {
                    expect(src.indexOf(base) !== -1).toBe(true);
                } else {
                    expect(src.indexOf(base) === -1).toBe(true);
                }
            }
        });

        /*
            This test failes sometimes in __ PhantomJS __ without wrapping setTimeout.
            Not sure why, but as its only in phantom atm, its ok.
        */
        setTimeout(function () {
            manager.render(name);
        }, 100);

        waitsFor(function () {
            return done;
        });

    });

    it('should switch to fallback', function () {

        var base = '//127.0.0.1';

        var manager = new Manager({
            iframeUrl: base + getPort(document.location.port) + iframeSrc,
            sameDomainIframeUrl: iframeSrc,
            deactivateCDFS: true
        });

        var name = 'cross_domain_force_fallback';
        var elem = helpers.insertContainer(name);
        var done = false;

        manager.queue({
            name: name,
            container: elem,
            url: '/base/test/fixtures/cdfs_fallback.js',
            width: 123,
            height: 300
        });

        manager.render(name, function (err, item) {
            expect(err).toBeUndefined();
            expect(item.input.width).toEqual(123);
            expect(item.input.height).toEqual(300);
            // cdfs_fallback sets a global from iframe. This wont work deactivateCDFS failed
            expect(window[name]).toEqual(name);
            var src = item.iframe.iframe.getAttribute('src');
            expect(src.indexOf(base) === -1).toBe(true);
            done = true;
        });

        waitsFor(function () {
            return done;
        });

    });

});
