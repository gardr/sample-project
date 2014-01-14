/*jshint expr: true*/
var Manager = require('../../src/lib/manager.js');
var iframeSrc = '/base/test/fixtures/iframe.html';

function getPort(port) {
    return port ? ':' + port : '';
}

describe('Cross domain iframe test', function () {

    it('should resolve cross domain', function (done) {

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

        manager.queue(name, {
            container: id,
            url: '/base/test/fixtures/config_content.js',
            width: 123,
            height: 321,
            done: function (err, item) {
                expect(err).to.be.undefined;
                expect(item).to.exist;
                expect(item.input.height).to.not.equal(0);
                assert.isNumber(item.input.height);
                
                var src = item.iframe.element.getAttribute('src');
                expect(src).to.contain(base);
                done();
            }
        });

        manager.render(name);
        
    });

});
