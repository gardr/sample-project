/* jshint maxlen: 99999 */
var com       = require('../../src/lib/com.js');
var support   = require('../../src/lib/support.js');
var helpers   = require('../testHelpers.js');

describe('Communcation / Messaging', function () {
    it('should be defined', function(){
        expect(com).toEqual(jasmine.any(Object));
    });

    function getOrigin(loc) {
        return loc.origin || (loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : ''));
    }

    describe('postMessage', function(){

        it('with support', function(){
            var done, result, win, origin;
            var obj    = {a: 'a', b: 'b'};
            var prefix = helpers.getRandomName();
            var ori = getOrigin(document.location);

            runs(function () {
                com.incomming(function(_result, _win, _origin){
                    result = _result;
                    win = _win;
                    origin = _origin;
                    done = true;
                }, prefix);

                var fn = com._postMessage(ori, global, prefix);

                expect(fn).toEqual(jasmine.any(Function));

                fn(obj);
            });

            waitsFor(function(){
                return done;
            });

            runs(function () {
                expect(result === obj).toBe(false);
                expect(result).toEqual(obj);
                expect(result.a).toEqual(obj.a);

                //check additional arguments
                expect(origin).toEqual(ori);
                expect(win).toEqual(global);
            });
        });
    });

});
