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
                    manager._resolve(name);
                });
            }
        };
    }

    it('should be defined', function () {
        var manager = helpers.testableManager();
        expect(manager).toEqual(jasmine.any(Manager));
    });

    describe('options', function () {

        it('should have logLevel default to 0', function () {
            var manager = new Manager();
            expect(manager.logLevel).toEqual(0);
        });

        it('should parse urlFragment for loglevel', function () {
            var manager = new Manager({ urlFragment: '#loglevel=3' });
            expect(manager.logLevel).toEqual(3);
        });

    });

    describe('_get', function(){
        it('should be undefined for new name', function(){
            var manager = helpers.testableManager();

            var obj = manager._get( helpers.getRandomName() );
            expect(obj).toBeUndefined();
        });

        it('should be defined for registered objects', function(){
            var manager = helpers.testableManager();
            var name = 'VALUE_1';
            manager.queue(name);
            var objRes = manager._get(name);
            expect(objRes).toBeDefined();
        });
    });

    describe('config', function(){
        var manager = helpers.testableManager();

        it('should be defined', function () {
            expect(typeof manager.config === 'function').toBe(true);
        });


        it('should allow config without options', function () {
            var name = helpers.getRandomName();

            manager.config(name);

            expect(manager._getConfig(name)).toBeDefined();
        });

        it('should set value and store config', function () {
            var name = helpers.getRandomName();

            manager.config(name, {
                'KEY_1': 'VALUE_1'
            });

            var obj2 = manager._getConfig(name);

            expect(obj2).toBeDefined();
            expect(obj2.KEY_1).toBe('VALUE_1');
        });

        it('should call config done when _resolve is called', function () {

            var called = 0;
            var name = helpers.getRandomName();

            manager.queue(name, {
                scriptUrl: scriptUrl,
                done: function () {
                    called++;
                }
            });

            manager._resolve(name);

            waitsFor(function () {
                return called === 1;
            });

        });

        it('_addToMap should throw on missing name', function () {
            expect(manager.queue).toThrow();
            expect(manager._addToMap).toThrow();
        });

        it('extendInframeData', function () {
            var input = {
                a: helpers.getRandomName()
            };
            manager.extendInframeData(input);
            expect(manager.__inject.a).toEqual(input.a);
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

            //expect(manager._getConfig(name).unique).toEqual(name);
            expect(manager._getConfig(name)).toBeUndefined();
        });

        it('should allow queueing without options', function () {
            var name = helpers.getRandomName();

            manager.queue(name);
            expect(manager._get(name)).toBeDefined();
        });

        it('should queue object to queued map', function () {
            var name = helpers.getRandomName();

            manager.queue(name, {
                unique: name,
                scriptUrl: scriptUrl
            });

            expect(manager._get(name).unique).toEqual(name);
        });

        it('should extend queued object with correct config object', function(){
            var name = helpers.getRandomName();
            manager.config(name, {
                foo : 'bar'
            });

            manager.queue(name);

            var result = manager._get(name);
            expect(result).toBeDefined();
            expect(result.foo).toEqual('bar');

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
            expect(result).toBeDefined();
            expect(result.foo).toEqual('fighters');

        });
    });

    describe('render', function () {
        var manager = helpers.testableManager();

        it('should return a Error if non existing configname', function () {
            manager.render(helpers.getRandomName(), function (err) {
                expect(err).toEqual(jasmine.any(Error));
            });
        });

        it('should add callback to callbacks', function () {
            var name = helpers.getRandomName();
            manager.queue(name);

            expect(manager.callbacks[name]).toBeUndefined();

            manager.render(name, function () {});

            expect(manager.callbacks[name]).toEqual(jasmine.any(Array));
        });

        it('should create a iframe and pass data', function () {
            var name = helpers.getRandomName();
            var done = false;

            manager.queue(name, {
                container: document.createElement('div'),
                url: scriptUrl,
                width: 999,
                height: 444
            });

            expect(manager._get(name).iframe).toBeUndefined();

            manager.render(name, function () {
                expect(manager._get(name).state).toEqual(State.RESOLVED);
                done = true;
            });

            var iframeElem = manager._get(name).iframe.iframe;

            expect(iframeElem).toBeDefined();
            var style = iframeElem.getAttribute('style').toString();
            expect(style.indexOf('999px') !== -1 && style.indexOf('444px') !== -1).toBe(true);

            manager._resolve(name);

            waitsFor(function () {
                return done;
            });

        });

        it('resolving banner should call callback', function () {
            var done = false;
            var name = helpers.getRandomName();

            manager.queue(name, {
                container: document.createElement('div'),
                url: scriptUrl
            });

            var item = manager.render(name, function (err, _state) {
                done = true;
                expect(err).toEqual(null);
                expect(_state).toEqual(jasmine.any(State));
            });

            expect(item.state).toEqual(State.ACTIVE);

            runs(function () {
                manager._resolve(name);
                expect(item.state).toEqual(State.RESOLVED);
            });

            waitsFor(function () {
                return done;
            });

        });

        it('more than one callback should _resolve before and after as well', function () {
            var calls = 5;
            var name = helpers.getRandomName();

            manager.queue(name, {
                container: document.createElement('div'),
                url: scriptUrl
            });

            function handler(err) {
                if (!err) {
                    calls--;
                }
            }

            manager.render(name, handler);
            manager.render(name, handler);

            runs(function () {
                manager._resolve(name);
                manager.render(name, handler);
                manager.render(name, handler);
                manager.render(name, handler);
            });

            waitsFor(function () {
                return calls === 0;
            });
        });

        it('should render and trigger callback', function () {
            var man = helpers.testableManager({
                iframeUrl: iframeUrl
            });
            var name = 'full_render-' + helpers.getRandomName();
            var id = 'container_' + name;
            var done = false;

            helpers.insertContainer(id);

            man.queue(name, {
                container: id
            });

            man.render(name, function () {
                done = true;
            });

            waitsFor(function () {
                return done;
            });
        });

        it('multiple document writes should work', function () {
            var manager = helpers.testableManager({
                iframeUrl: iframeUrl
            });
            var done = false;
            var name = 'write_3_times_';
            var elem = helpers.insertContainer(name);

            manager.queue(name, {
                container: elem,
                width: 500,
                height: 100,
                url: '/base/test/fixtures/docwrite1.js'
            });

            manager.render(name, function (err, item) {
                expect(err).toBeUndefined();
                expect(item.input.width).toEqual(500);
                expect(item.input.height).toEqual(100);
                done = true;
            });

            waitsFor(function () {
                return done;
            });
        });
    });
    
    describe('renderAll', function () {

        it('should call "__all"-callback when _resolved', function () {
            var num = 5;
            var rand = queueRandom(num);
            var done = false;


            expect(Object.keys(rand.manager.items).length).toEqual(num);

            rand.manager.renderAll(function (err, items) {
                done = true;
                expect(err).toBeUndefined();
                expect(items).toBeDefined();
                expect(Object.keys(items).length).toEqual(num);
                var first = rand.manager._get(rand.names[0]);
                expect(first).toEqual(jasmine.any(State));
            });

            rand.forceResolveAll();

            waitsFor(function () {
                return done;
            });
        });

        it('should call "__all"-callback when _resolved', function () {
            var num = 5;
            var rand = queueRandom(num);
            var counter = num;
            var done = 0;


            expect(Object.keys(rand.manager.items).length).toEqual(num);

            rand.manager.renderAll(function (err) {
                done++;
                expect(done).toEqual(1);
                expect(err).toBeUndefined();
            });

            rand.names.forEach(function (name) {
                rand.manager.render(name, function () {
                    counter--;
                });
            });

            rand.forceResolveAll();

            waitsFor(function () {
                return done === 1 && counter === 0;
            });
        });

        it('should _resolve all without commastring', function () {
            var num = 5;
            var rand = queueRandom(num);
            var counter = num;
            var done = false;

            expect(Object.keys(rand.manager.items).length).toEqual(num);

            rand.manager.renderAll(function (err) {
                done = true;
                expect(err).toBeUndefined();
            });

            rand.names.forEach(function (name) {
                rand.manager.render(name, function () {
                    counter--;
                });
                rand.manager._resolve(name);
            });

            waitsFor(function () {
                return done && counter === 0;
            });
        });

        it('should render in the priority order', function () {
            var num = 5;
            var done = false;
            var rand = queueRandom(num);
            var manager = rand.manager;
            var reverseNames = rand.names.slice(0).reverse();

            spyOn(manager, 'render').andCallFake(function (name, cb) {
                manager._resolve(name);
                if (cb) {cb();}
            });

            rand.manager.renderAll(reverseNames.join(','), function (err) {
                done = true;
                expect(err).toBeUndefined();
            });

            expect(manager.render).toHaveBeenCalled();
            expect(manager.render.callCount).toEqual(rand.names.length);
            expect(manager.render.argsForCall[0][0]).toEqual(reverseNames[0]);
            expect(manager.render.argsForCall[1][0]).toEqual(reverseNames[1]);
            expect(manager.render.argsForCall[4][0]).toEqual(reverseNames[4]);

        });

        it('should _resolve not prioritated banners', function () {
            var num = 3;
            var done = false;
            var rand = queueRandom(num);
            var manager = rand.manager;

            spyOn(manager, 'render').andCallFake(function (name, cb) {
                manager._resolve(name);
                if (cb) {cb();}
            });

            rand.manager.renderAll(rand.names[num -1], function (err) {
                done = true;
                expect(err).toBeUndefined();
            });

            expect(manager.render).toHaveBeenCalled();
            expect(manager.render.callCount).toEqual(rand.names.length);
            expect(manager.render.argsForCall[0][0]).toEqual(rand.names[num -1]);
            expect(manager.render.argsForCall[1][0]).toEqual(rand.names[0]);
            expect(manager.render.argsForCall[2][0]).toEqual(rand.names[1]);

        });

        //it('should _resolve multiple')
    });

    describe('refresh', function () {

        it('should refresh single banner', function () {
            var name = 'iframe_refresh';
            var done = false;
            var manager = new Manager({iframeUrl: iframeUrl});
            var container = helpers.insertContainer(name);

            manager.queue(name, {
                container: container,
                url: scriptUrl,
                width: 123,
                height: 123
            });

            manager.render(name, function(err, item){
                expect(item.state).toEqual(State.RESOLVED);

                expect(item.rendered).toEqual(1);
                var beforeSrc = item.iframe.iframe.src;

                manager.refresh(name, function (err, item) {

                    expect(item.rendered).toEqual(2);
                    expect(item.iframe.iframe.src).not.toBeUndefined();
                    expect(item.iframe.iframe.src).not.toEqual(beforeSrc);
                    done = true;
                });

            });

            waitsFor(function(){
                return done;
            });
        });


        it('calling refresh on missing iframe should reset', function(){

            var name = 'iframe_refresh_crash';
            var done = false;
            var manager = new Manager({iframeUrl: iframeUrl});
            var container = helpers.insertContainer(name);

            manager.queue(name, {
                container: container,
                url: scriptUrl,
                width: 123,
                height: 123
            });

            manager.render(name, function(err, item){
                expect(item.state).toEqual(State.RESOLVED);
                expect(item.rendered).toEqual(1);

                item.iframe.remove();

                var oldIframe = item.iframe;
                manager.refresh(name, function (err, item2) {
                    expect(item2.rendered).toEqual(2);
                    expect(item).toBe(item2);
                    expect(oldIframe).not.toEqual(item2.iframe);
                    done = true;
                });

            });

            waitsFor(function(){
                return done;
            });
        });
    });

    describe('refreshAll', function () {

        it('should refresh all banners', function () {
            var num = 10;
            var rand = queueRandom(num);
            var done = false;

            rand.manager.renderAll();
            rand.forceResolveAll();

            var first = rand.manager._get(rand.names[0]);

            rand.manager.refreshAll(function (err, items) {
                expect(err).toBeUndefined();
                expect(items).toBeDefined();
                expect(Object.keys(items).length).toEqual(num);

                expect(first).toEqual(jasmine.any(State));
                expect(first.rendered).toEqual(2, first.name + ' should be rendered 2 times');
                done = true;
            });

            setTimeout(function(){
                expect(first.state).toEqual(State.REFRESHING, 'expected state to be equal to NEEDS_REFRESH');
                expect(first.rendered).toEqual(1);

                rand.forceResolveAll();
            }, 0);

            waitsFor(function () {
                return done === true;
            });
        });


    });

    describe('fail', function(){

        it('should _resolve banner', function(){
            var done    = false;
            var manager = helpers.testableManager({iframeUrl: iframeUrl});
            var name    = helpers.getRandomName();

            manager.queue(name);

            manager.render(name, function(err/*, item*/){
                expect(err).toBeDefined();
                done = true;
            });

            manager._fail(name);
        });


        it('should fail on empty pixel', function(){
            var manager = helpers.testableManager({iframeUrl: iframeUrl});
            var done = false;
            var name = '_fail'+helpers.getRandomName();

            manager.queue(name, {
                container: helpers.insertContainer(name),
                width: 11,
                height: 12,
                url: '/base/test/fixtures/fail.js',
                fail: function(){
                    done = true;
                }
            });

            manager.render(name, function (err, item) {
                expect(item.isUsable()).toBe(true, 'Expected item be usable');
                expect(item.hasFailed()).toBe(true, 'Expected item be in fail-state');
            });

            waitsFor(function () {
                return done;
            });
        });
    });

    describe('BannerFlags', function () {
        it('should work', function () {
            var done = false;
            var manager = helpers.testableManager({
                iframeUrl: iframeUrl
            });
            var name = 'bannerflags_' + helpers.getRandomName();
            var elem = helpers.insertContainer(name);

            manager.queue(name, {
                url: '/base/test/fixtures/bannerflag.js',
                container: elem
            });

            manager.render(name, function (err, item) {
                expect(err).toBeUndefined();
                expect(item.name).toEqual(name);
                setTimeout(function () {
                    expect(manager.flags[name + '_flag']).toEqual(name);
                    done = true;
                }, 16);
            });

            waitsFor(function () {
                return done;
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
