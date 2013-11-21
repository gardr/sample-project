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
            var done;
            if (support.crossDomainFrameSupport){



                var obj    = {a: 'a', b: 'b'};
                var prefix = helpers.getRandomName();
                var ori = getOrigin(document.location);

                com.incomming(function(result, win, origin){
                    expect(result === obj).toBe(false);
                    expect(result).toEqual(obj);
                    expect(result.a).toEqual(obj.a);

                    //check additional arguments
                    expect(origin).toEqual(ori);
                    expect(win).toEqual(global);
                    done = true;
                }, prefix);

                var fn = com._postMessage(ori, global, prefix);

                expect(fn).toEqual(jasmine.any(Function));

                fn(obj);

            } else {
                done = true;
            }

            waitsFor(function(){
                return done;
            });
        });


        it('without support', function(){
            global[support.cdfsKey] = true;

            var done   = false;
            var obj    = {a: 'a', b: 'b'};
            var prefix = helpers.getRandomName();

            com.incomming(function(result, win, origin){
                expect(result === obj).toBe(true);
                expect(win).toBeUndefined();
                expect(origin).toBeUndefined();
                done = true;
            }, prefix);

            var fn = com._postMessage('ORIGIN_NOT_IN_USE', global, prefix);

            expect(fn).toEqual(jasmine.any(Function));

            fn(obj);

            global[support.cdfsKey] = undefined;

            waitsFor(function(){
                return done;
            });

        });
    });

});
