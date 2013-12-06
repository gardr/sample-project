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

        var body = document.getElementsByTagName('body')[0];
        var container = document.createElement('div');

        container.id = id;
        body.appendChild(container);

        var spy = jasmine.createSpy('done');
        manager.queue(name, {
            container: id,
            url: '/base/test/fixtures/config_content.js',
            width: 123,
            height: 321,
            done: spy
        });

        runs(function () {
            manager.render(name);
        });

        waitsFor(function () {
            return spy.calls.length===1;
        });

        runs(function () {
            expect(spy).toHaveBeenCalled();
            var err = spy.mostRecentCall.args[0];
            var item = spy.mostRecentCall.args[1];
            expect(err).toBeUndefined();
            expect(item).toBeDefined();
            expect(item.input.height).not.toEqual(0);
            expect(item.input.height).toEqual(jasmine.any(Number));
            
            var src = item.iframe.element.getAttribute('src');
            expect(src).toContain(base);
        });

    });

});
