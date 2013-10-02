var patch = require('../../src/lib/raf.js');

describe('requestAnimationFrame patch', function () {
    it('should be defined', function () {
        expect(patch).toBeDefined();
    });

    it('should hollaback', function () {
        patch();
        var done = false;
        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function(){
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        });
    });

    it('should cancel when calling cancelAnimationFrame', function(){
        var done = true;
        var called = false;

        var req = window.requestAnimationFrame(function(){
            called = true;
        });

        window.cancelAnimationFrame(req);

        setTimeout(function(){
            done = true;
        }, 20);

        waitsFor(function(){
            return done && called === false;
        });

    });

});
