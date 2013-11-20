var getSize = require('../../src/lib/size.js');
var helpers = require('../testHelpers.js');

var iframeUrl = '/base/test/fixtures/iframe.html';

describe('Element size', function () {

    it('should be defined', function () {
        expect(getSize).toEqual(jasmine.any(Function));
    });

    var manager = helpers.testableManager({
        iframeUrl: iframeUrl
    });

    it('should return correct sizes from domElement', function () {

        var elem = helpers.insertContainer();
        elem.style.width = '200px';
        elem.style.height = '100px';

        expect(getSize(elem)).toEqual({
            width: 200,
            height: 100
        });

    });

    it('should return correct sizes from within iframe', function () {
        var done = false;
        var name = 'check_size';
        var elem = helpers.insertContainer(name);

        manager.queue(name, {
            container: elem,
            width: 123,
            height: 120,
            url: '/base/test/fixtures/config_content.js'
        });

        manager.render(name, function (err, item) {
            expect(err).toBeUndefined();
            expect(item.input.width).toEqual(123);
            expect(item.input.height).toEqual(120);
            done = true;
        });

        waitsFor(function () {
            return done;
        });
    });

    it('multiple document writes should work', function () {

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

    it('should return correct height for responsive container', function () {
        var done = false;
        var name = '_responsive';
        var elem = helpers.insertContainer(name);

        manager.queue(name,{
            container: elem,
            width: 1,
            height: 1,
            url: '/base/test/fixtures/responsive.js'
        });

        manager.render(name, function (err, item) {
            assertResponsive(err, item);
            done = true;
        });

        waitsFor(function () {
            return done;
        });

    });

    function assertResponsive(err, item) {
        expect(err).toBeUndefined();
        expect(item.input.responsive).toEqual(true);
        expect(item.input.height).toEqual(225);
    }

    // todo these tests for reponsive doesnt belong against size.js,
    // because they now live in endpoint file mobile.inframe.js

    it('should return height for responsive class', function () {
        var done = false;
        var name = '_responsive2';
        var elem = helpers.insertContainer(name);

        manager.queue(name, {
            container: elem,
            width: 1,
            height: 1,
            url: '/base/test/fixtures/responsive_data-responsive.js'
        });

        manager.render(name, function (err, item) {
            assertResponsive(err, item);
            done = true;
        });

        waitsFor(function () {
            return done;
        });
    });

    it('should return height for appended responsive html', function () {
        var done = false;
        var name = '_responsive3';

        manager.queue(name, {
            container: helpers.insertContainer(name),
            width: 11,
            height: 12,
            url: '/base/test/fixtures/responsive_append.js'
        });

        manager.render(name, function (err, item) {
            assertResponsive(err, item);
            done = true;
        });

        waitsFor(function () {
            return done;
        });
    });

    it('should fail on empty pixel', function(){
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
