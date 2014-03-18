/*jshint expr: true*/
/*global gardrHost:false*/
var iframeSrc = '/base/node_modules/gardr-ext/iframe.html';

function getPort(port) {
    return port ? ':' + port : '';
}

describe('Cross domain iframe', function () {
    // cross-domain
    var base = '//127.0.0.1';
    var iframeUrl = base + getPort(document.location.port) + iframeSrc;
    var gardr = gardrHost({
        iframeUrl: iframeUrl,
        extScriptUrl: '/base/browserified/extBundle.js',
        es5shimUrl: '/base/test/lib/Function-polyfill.js'
    });

    it('should render banner and report rendered size', function (done) {
        var name = 'cross_domain_test';
        var id = 'container_' + name;
        var container = document.body.appendChild( document.createElement('div') );
        container.id = id;

        gardr.queue(name, {
            container: id,
            url: '/base/test/fixtures/responsive.js',
            width: 123,
            height: 225
        });

        gardr.render(name, function (err, item) {
            expect(err).to.be.undefined;
            expect(item).to.exist;
            expect(item.rendered.height).to.equal(225);
            expect(item.rendered.width).to.equal(123);

            var src = item.iframe.element.getAttribute('src');
            expect(src).to.contain(base);
            done();
        });

    });

});
