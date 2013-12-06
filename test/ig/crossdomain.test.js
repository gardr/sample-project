var helpers = require('../testHelpers.js');
var Manager = require('../../src/lib/manager.js');
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

        manager.queue(name, {
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

                var src = item.iframe.element.getAttribute('src');

                // as this will test in not usable browsers, we need to asure result

                expect(src.indexOf(base) !== -1).toBe(true);
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

});
