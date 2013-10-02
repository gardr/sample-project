var helpers = require('../testHelpers.js');

var iframeSrc = '/base/test/fixtures/iframe.html';

function getPort(port){
    return port ? ':' + port : '';
}

describe('Cross domain iframe test', function () {

    it('should resolve cross domain', function () {

        var manager = helpers.testableManager({
            iframeUrl: '//127.0.0.1' + getPort(document.location.port) + iframeSrc,
            sameDomainIframeUrl: iframeSrc
        });

        var name = 'cross_domain_test';
        var id   = 'container_' + name;
        var done = false;

        var body = document.getElementsByTagName('body')[0];
        var container = document.createElement('div');

        container.id = id;
        body.appendChild(container);

        manager.queue({
            name: name,
            container: id
        });

        manager.render(name, function () {
            done = true;
        });

        waitsFor(function () {
            return done;
        });

    });

});
