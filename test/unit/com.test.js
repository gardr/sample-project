/* jshint maxlen: 99999 */
var com       = require('../../src/lib/com.js');
var support   = require('../../src/lib/support.js');
var helpers   = require('../testHelpers.js');

describe('Communcation / Messaging', function () {
    it('should be defined', function(){
        expect(com).toEqual(jasmine.any(Object));
    });

    describe('getHash', function(){
        //firefox returns addyn?

        //http://helios.finn.no/addyn|3.0|72.23|4489198|0|16|ADTECH;cookie=info;loc=100;target=_blank;alias=realestate%2Fnewbuildings%2Fsearch%2Flist_mm;grp=196228776;kvuserid=1754579083;misc=527682197289185

        var result = com.getHash(
            '#'+com.PREFIX+'_|_1_|_a=a_|_a=a&url=http%3A//helios.finn.no/addyn%7C3.0%7C72.23%7C4489198%7C0%7C16%7CADTECH%3Bcookie%3Dinfo%3Bloc%3D100%3Btarget%3D_blank%3Balias%3Drealestate%252Fnewbuildings%252Fsearch%252Flist_mm%3Bgrp%3D196228776%3Bkvuserid%3D1754579083%3Bmisc%3D527682197289185&b=b&c=c&d=d'
        );

        it('should deparam internal and params', function(){
            expect(result.name).toEqual('1');
            expect(result.internal.a).toEqual('a');
            expect(result.params.a).toEqual('a');
            expect(result.params.b).toEqual('b');

            expect(result.params.url)
                .toEqual('http://helios.finn.no/addyn|3.0|72.23|4489198|0|16|ADTECH;cookie=info;loc=100;target=_blank;alias=realestate%2Fnewbuildings%2Fsearch%2Flist_mm;grp=196228776;kvuserid=1754579083;misc=527682197289185');

        });



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
