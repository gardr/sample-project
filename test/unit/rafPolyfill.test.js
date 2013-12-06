var rafPolyfill = require('../../src/lib/rafPolyfill.js');

describe('rafPolyfill', function () {
    var RAF_KEY = 'requestAnimationFrame';
    var CRAF_KEY = 'cancelAnimationFrame';
    var orgRAF = window[RAF_KEY];
    var orgCRAF = window[CRAF_KEY];
    
    beforeEach(function () {
        window[RAF_KEY] = true;
        window[CRAF_KEY] = true;
        rafPolyfill(true);
        jasmine.Clock.useMock();
    });

    afterEach(function () {
        rafPolyfill._reset();
        window[RAF_KEY] = orgRAF;
        window[CRAF_KEY] = orgCRAF;
    });

    describe('requestAnimationFrame', function () {
        it('should be a function without native code', function () {
            var raf = window[RAF_KEY];
            expect(typeof raf).toEqual('function');
            expect(raf.toString()).not.toContain('[native code]');
        });

        it('should hollaback', function () {
            var done = false;

            window.requestAnimationFrame(function () {
                window.requestAnimationFrame(function(){
                    done = true;
                });
                jasmine.Clock.tick(16);
            });
            jasmine.Clock.tick(16);

            expect(done).toEqual(true);
        });
    });

    describe('cancelRequestAnimationFrame', function () {
        it('should be a function without native code', function () {
            var craf = window[CRAF_KEY];
            expect(typeof craf).toEqual('function');
            expect(craf.toString()).not.toContain('[native code]');
        });

        it('should cancel when calling cancelAnimationFrame', function(){
            var called = false;

            var req = window.requestAnimationFrame(function(){
                called = true;
            });
            window.cancelAnimationFrame(req);
            jasmine.Clock.tick(16);

            expect(called).toEqual(false);
        });
    });
});
