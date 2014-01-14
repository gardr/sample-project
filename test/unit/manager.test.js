/*jshint expr: true*/
var State = require('../../src/lib/state.js');
var helpers = require('../testHelpers.js');

var Manager = require('../../src/lib/manager.js');

var scriptUrl = '/base/test/fixtures/config_content.js';
var iframeUrl = '/base/test/fixtures/iframe.html';

describe('Manager', function () {

    function queueRandom(num) {
        var manager = helpers.testableManager();
        var names = helpers.getRandomNames(num);

        names.forEach(function (name) {
            manager.queue(name, {
                container: document.createElement('div'),
                url: scriptUrl,
                width: 300,
                height: 225
            });
        });

        return {
            manager: manager,
            names: names,
            forceResolveAll: function () {
                names.forEach(function (name) {
                    manager._forEachWithName(name, function (item) {
                        manager._resolve(item.id);
                    });
                });
            }
        };
    }

    it('should be defined', function () {
        var manager = helpers.testableManager();
        expect(manager).to.be.an.instanceof(Manager);
    });

    describe('options', function () {

        it('should have logLevel default to 0', function () {
            var manager = new Manager();
            expect(manager.logLevel).to.equal(0);
        });

        it('should parse urlFragment for loglevel', function () {
            var manager = new Manager({ urlFragment: '#loglevel=3' });
            expect(manager.logLevel).to.equal(3);
        });

    });

    describe('_get', function(){
        it('should be undefined for new name', function(){
            var manager = helpers.testableManager();

            var arr = manager._get( helpers.getRandomName() );
            expect(arr[0]).to.be.undefined;
        });

        it('should be defined for registered objects', function(){
            var manager = helpers.testableManager();
            var name = 'VALUE_1';
            manager.queue(name);
            var objRes = manager._get(name)[0];
            expect(objRes).to.exist;
        });
    });

    describe('_getById', function () {
        it('should return undefined for nonexisting id', function () {
            var manager = helpers.testableManager();
            expect(manager._getById('does-not-exist')).to.be.undefined;
        });

        it('should return the state item given an existing id', function() {
            var manager = helpers.testableManager();
            var name = helpers.getRandomName();
            manager.queue(name);
            var stateItem = manager._get(name)[0];

            var result = manager._getById(stateItem.id);
            expect(result).to.exist;
            expect(result.id).to.equal(stateItem.id);
            expect(result.name).to.equal(name);
        });
    });

    describe('config', function(){
        var manager = helpers.testableManager();

        it('should be defined', function () {
            expect(typeof manager.config === 'function').to.equal(true);
        });


        it('should allow config without options', function () {
            var name = helpers.getRandomName();

            manager.config(name);

            expect(manager._getConfig(name)).to.exist;
        });

        it('should set value and store config', function () {
            var name = helpers.getRandomName();

            manager.config(name, {
                'KEY_1': 'VALUE_1'
            });

            var obj2 = manager._getConfig(name);

            expect(obj2).to.exist;
            expect(obj2.KEY_1).to.equal('VALUE_1');
        });

        it('should call config done when _resolve is called', function () {

            var spy = sinon.spy();
            var name = helpers.getRandomName();

            manager.config(name, {done: spy});
            manager.queue(name, {
                scriptUrl: scriptUrl
            });

            manager._resolve(manager._get(name)[0].id);
            sinon.assert.calledOnce(spy);
        });

        it('extendInframeData', function () {
            var input = {
                a: helpers.getRandomName()
            };
            manager.extendInframeData(input);
            expect(manager.__inject.a).to.equal(input.a);
        });

    });

    describe('queue', function(){
        var manager = helpers.testableManager();

        it('should not add queue objects to config map', function () {
            var name = helpers.getRandomName();

            manager.queue(name, {
                unique: name,
                scriptUrl: scriptUrl
            });

            expect(manager._getConfig(name)).to.be.undefined;
        });

        it('should throw on missing name', function () {
            expect(manager.queue).to.throw();
        });

        it('should allow queueing without options', function () {
            var name = helpers.getRandomName();

            manager.queue(name);
            expect(manager._get(name)).to.exist;
        });

        it('should allow specifying container in config', function () {
            var name = helpers.getRandomName();
            var container = document.createElement('div');
            manager.config(name, {container: container});
            manager.queue(name, {url: 'test'});
            expect(manager._get(name)[0].container).to.equal(container);
        });

        it('should allow specifying container in queue', function () {
            var name = helpers.getRandomName();
            var container = document.createElement('div');
            manager.queue(name, {container: container,url: 'test'});
            expect(manager._get(name)[0].container).to.equal(container);
        });

        it('should queue object to queued map', function () {
            var name = helpers.getRandomName();

            manager.queue(name, {
                unique: name,
                scriptUrl: scriptUrl
            });

            expect(manager._get(name).length).to.equal(1);
            expect(manager._get(name)[0].unique).to.equal(name);
        });

        it('should extend queued object with correct config object', function(){
            var name = helpers.getRandomName();
            manager.config(name, {
                foo : 'bar'
            });

            manager.queue(name);

            var result = manager._get(name);
            expect(result.length).to.equal(1);
            expect(result[0].foo).to.equal('bar');

        });

        it('should overwrite property from config with queued object', function(){
            var name = helpers.getRandomName();
            manager.config(name, {
                foo : 'bar'
            });

            manager.queue(name, {
                foo : 'fighters'
            });

            var result = manager._get(name);
            expect(result.length).to.equal(1);
            expect(result[0].foo).to.equal('fighters');

        });

        it('should be able to queue multiple times for same config name', function () {
            var name = helpers.getRandomName();
            manager.config(name, {test: 'multiple'});

            manager.queue(name);
            manager.queue(name);
            var items = manager._get(name);
            expect(items.length).to.equal(2);
            expect(items[0].id).not.to.equal(items[1].id);
        });


    });

    describe('render', function () {
        var manager = helpers.testableManager();

        it('should return a Error if non existing configname', function () {
            manager.render(helpers.getRandomName(), function (err) {
                expect(err).to.be.an.instanceof(Error);
            });
        });

        it('should create an iframe', function () {
            var name = helpers.getRandomName();

            manager.queue(name, {
                container: document.createElement('div'),
                url: 'test'
            });
            expect(manager._get(name)[0].iframe).not.to.exist;
            manager.render(name, function () {});

            expect(manager._get(name)[0].iframe).to.exist;
        });

        it('should pass id as unique name to iframe', function () {
            var name = helpers.getRandomName();
            manager.queue(name, {url: 'test'});
            
            manager.render(name, function () {});
            
            var items = manager._get(name);
            expect(items).to.have.length.above(0);
            expect(items[0]).to.exist;
            expect(items[0].iframe).to.exist;
            var iframe = manager._get(name)[0].iframe;
            expect(iframe.name).not.to.equal(name);
        });

        it('two items with same name should have different iframe ids', function () {
            var name = helpers.getRandomName();
            manager.queue(name, {url: 'test'});
            manager.queue(name, {url: 'test'});
            manager.render(name);
            var items = manager._get(name);
            var iframe1 = items[0].iframe;
            var iframe2 = items[1].iframe;
            expect(iframe1.id).not.to.equal(iframe2.id);
        });

        it('should pass width and height to iframe', function () {
            var name = helpers.getRandomName();
            var width = 999;
            var height = 444;

            manager.queue(name, {
                container: document.createElement('div'),
                url: 'test',
                width: width,
                height: height
            });
            manager.render(name, function () {});

            var iframe = manager._get(name)[0].iframe;
            expect(iframe.width).to.equal(width);
            expect(iframe.height).to.equal(height);

        });

        it('should set script url as data on iframe', function () {
            var name = helpers.getRandomName();

            manager.queue(name, {
                container: document.createElement('div'),
                url: scriptUrl
            });
            
            manager.render(name, function () {});
            expect(manager._get(name)[0].iframe.data.url).to.equal(scriptUrl);

        });

        it('resolving banner should call callback', function (done) {
            var name = helpers.getRandomName();

            manager.queue(name, {
                container: document.createElement('div'),
                url: scriptUrl
            });

            manager.render(name, function (err, _state) {
                expect(err).not.to.exist;
                expect(_state).to.be.an.instanceof(State);
                done();
            });

            manager._resolve(manager._get(name)[0].id);
        });

        it('more than one callback should _resolve before and after as well', function () {
            var calls = 0;
            var name = helpers.getRandomName();

            manager.queue(name, {
                container: document.createElement('div'),
                url: scriptUrl
            });

            function handler(err) {
                if (!err) {
                    calls++;
                } else {
                    throw new Error();
                }
            }

            manager.render(name, handler);
            manager.render(name, handler);
            manager._resolve(manager._get(name)[0].id);
            manager.render(name, handler);
            manager.render(name, handler);
            manager.render(name, handler);
            expect(calls).to.equal(5);
        });

        it('should call the callback for each item with same name', function () {
            var name = helpers.getRandomName();
            manager.config(name, {
                url: 'test'
            });
            manager.queue(name);
            manager.queue(name);

            var calls = 0;
            manager.render(name, function () {
                calls++;
            });

            manager._forEachWithName(name, function (item) {
                manager._resolve(item.id);
            });

            expect(calls).to.equal(2);
        });

        it('should render and trigger callback', function (done) {
            var man = helpers.testableManager({
                iframeUrl: iframeUrl
            });
            var name = 'full_render-' + helpers.getRandomName();
            var id = 'container_' + name;
            helpers.insertContainer(id);

            man.queue(name, {
                container: id,
                url: 'test'
            });

            man.render(name, function () {
                done();
            });
        });

        it('multiple document writes should work', function (done) {
            var manager = helpers.testableManager({
                iframeUrl: iframeUrl
            });
            var name = 'write_3_times_';
            var elem = helpers.insertContainer(name);

            manager.queue(name, {
                container: elem,
                width: 500,
                height: 100,
                url: '/base/test/fixtures/docwrite1.js'
            });

            manager.render(name, function (err, item) {
                expect(err).to.be.undefined;
                expect(item.input.width).to.equal(500);
                expect(item.input.height).to.equal(100);
                done();
            });
        });
    });
    
    describe('renderAll', function () {

        it('should call "__all"-callback when _resolved', function () {
            var num = 5;
            var rand = queueRandom(num);
            var spy = sinon.spy();

            rand.manager.renderAll(spy);
            rand.forceResolveAll();

            var err = spy.args[0][0];
            var items = spy.args[0][1];

            expect(err).to.be.undefined;
            expect(items).to.exist;
            expect(items.length).to.equal(num);
            var first = rand.manager._get(rand.names[0])[0];
            expect(first).to.be.an.instanceof(State);
        });

        it('should call "__all"-callback only once', function () {
            var rand = queueRandom(5);
            var spy = sinon.spy();
            rand.manager.renderAll(spy);
            rand.forceResolveAll();
            expect(spy.calledOnce).to.be.true;

        });

        it('should _resolve all without commastring', function (done) {
            var num = 5;
            var rand = queueRandom(num);
            var counter = num;

            rand.manager.renderAll(function (err) {
                expect(err).to.be.undefined;
                expect(counter).to.equal(0);
                done();
            });

            rand.names.forEach(function (name) {
                rand.manager.render(name, function () {
                    counter--;
                });
                var item = rand.manager._get(name)[0];
                rand.manager._resolve(item.id);
            });
        });

        it('should render in the priority order', function (done) {
            var num = 5;
            var rand = queueRandom(num);
            var manager = rand.manager;
            var reverseNames = rand.names.slice(0).reverse();
            sinon.stub(manager, 'render', function (name, cb) {
                manager._resolve(manager._get(name)[0].id);
                if (cb) {cb();}
            });

            rand.manager.renderAll(reverseNames.join(','), function (err) {
                expect(err).to.be.undefined;
                done();
            });
            expect(manager.render.callCount).to.equal(rand.names.length);
            expect(manager.render.args[0][0]).to.equal(reverseNames[0]);
            expect(manager.render.args[1][0]).to.equal(reverseNames[1]);
            expect(manager.render.args[4][0]).to.equal(reverseNames[4]);

        });

        it('should _resolve not prioritated banners', function (done) {
            var num = 3;
            var rand = queueRandom(num);
            var manager = rand.manager;
            var stub = sinon.stub(manager, 'render', function (name, cb) {
                manager._forEachWithName(name, function (item) {
                    manager._resolve(item.id);
                });
                if (cb) {cb();}
            });

            manager.renderAll(rand.names[num -1], function (err) {
                expect(err).to.be.undefined;

                //stub.restore();
                done();
            });

            expect(stub.calledThrice).to.be.true;
            expect(manager.render.callCount).to.equal(rand.names.length);
            expect(manager.render.args[0][0]).to.equal(rand.names[num -1]);
            expect(manager.render.args[1][0]).to.equal(rand.names[0]);
            expect(manager.render.args[2][0]).to.equal(rand.names[1]);

        });

        //it('should _resolve multiple')
    });

    describe('refresh', function () {

        it('should refresh single banner', function (done) {
            var name = 'iframe_refresh' + helpers.getRandomName();
            var manager = new Manager({iframeUrl: iframeUrl});
            var container = helpers.insertContainer(name);

            manager.queue(name, {
                container: container,
                url: scriptUrl,
                width: 123,
                height: 123
            });

            manager.render(name, function(err, item){
                expect(item.state).to.equal(State.RESOLVED);

                expect(item.rendered).to.equal(1);
                var beforeSrc = item.iframe.element.src;

                manager.refresh(name, function (err, item) {
                    expect(item.rendered).to.equal(2);
                    expect(item.iframe.element.src).not.to.be.undefined;
                    expect(item.iframe.element.src).not.to.equal(beforeSrc);
                    done();
                });

            });
        });


        it('calling refresh on missing iframe should reset', function(done){
            var name = 'iframe_refresh_crash';
            var manager = new Manager({iframeUrl: iframeUrl});
            var container = helpers.insertContainer(name);

            manager.queue(name, {
                container: container,
                url: scriptUrl,
                width: 123,
                height: 123
            });

            manager.render(name, function(err, item){
                expect(item.state).to.equal(State.RESOLVED);
                expect(item.rendered).to.equal(1);

                item.iframe.remove();

                var oldIframe = item.iframe;
                manager.refresh(name, function (err, item2) {
                    expect(item2.rendered).to.equal(2);
                    expect(item).to.equal(item2);
                    expect(oldIframe).not.to.equal(item2.iframe);
                    expect(item.isResolved()).to.equal(true);
                    done();
                });

            });
        });
    });

    describe('refreshAll', function () {

        it('should refresh all banners', function (done) {
            var num = 10;
            var rand = queueRandom(num);

            rand.manager.renderAll();
            rand.forceResolveAll();

            var first = rand.manager._get(rand.names[0])[0];

            rand.manager.refreshAll(function (err, items) {
                expect(err).to.be.undefined;
                expect(items).to.exist;
                expect(items.length).to.equal(num);

                expect(first).to.be.an.instanceof(State);
                expect(first.rendered).to.equal(2, first.name + ' should be rendered 2 times');
                done();
            });

            expect(first.state).to.equal(State.REFRESHING, 'expected state to be equal to NEEDS_REFRESH');
            expect(first.rendered).to.equal(1);
            rand.forceResolveAll();
        });


    });

    describe('fail', function(){

        it('should run callback with error', function (done) {
            var manager = helpers.testableManager();
            var name    = helpers.getRandomName();

            manager.queue(name, {url: 'test'});

            manager.render(name, function(err){
                expect(err).to.exist;
                done();
            });

            var item = manager._get(name)[0];
            manager._fail(item.id, {message: 'error'});
        });


        it('should fail on empty pixel', function (done) {
            var manager = helpers.testableManager();
            var name = '_fail' + helpers.getRandomName();
            var spy = sinon.spy();

            manager.queue(name, {
                width: 11,
                height: 12,
                url: 'test',
                fail: spy
            });

            manager.render(name, function (err, item) {
                expect(item.isUsable()).to.equal(true, 'Expected item be usable');
                expect(item.hasFailed()).to.equal(true, 'Expected item be in fail-state');
                expect(spy.calledOnce).to.equal(true);
                done();
            });

            var item = manager._get(name)[0];
            manager._delegate({
                cmd: 'fail',
                msg: 'pixel',
                id: item.id
            }, item);
        });
    });

    describe('BannerFlags', function () {
        it('should be able to set flag', function (done) {
            var manager = helpers.testableManager({
                iframeUrl: iframeUrl
            });
            manager.flags.foo = 'bar';
            var name = 'bannerflags_' + helpers.getRandomName();
            var elem = helpers.insertContainer(name);

            manager.queue(name, {
                url: '/base/test/fixtures/bannerflag.js',
                container: elem
            });

            manager.render(name, function (err, item) {
                expect(err).to.be.undefined;
                expect(item.name).to.equal(name);
                expect(manager.flags.flag).to.equal(item.id);
                done();
            });
        });
    });

    describe('incomming commands', function () {

        describe('resize', function () {

            it('should not resize if ignoreResize is true', function () {
                //TODO
            });

        });

    });
});