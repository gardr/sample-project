/* jshint maxlen: 99999 */
var com       = require('../../src/lib/com.js');
var helpers   = require('../testHelpers.js');

describe('Communcation / Messaging', function () {
    it('should be defined', function(){
        expect(com).to.be.an('object');
    });

    function getOrigin(loc) {
        return loc.origin || (loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : ''));
    }

    describe('postMessage', function(){

        it('with support', function(done){
            var obj    = {a: 'a', b: 'b'};
            var prefix = helpers.getRandomName();
            var ori = getOrigin(document.location);

            com.incomming(function(result, win, origin){
                expect(result === obj).to.equal(false);
                expect(result).to.eql(obj);
                expect(result.a).to.equal(obj.a);

                //check additional arguments
                expect(origin).to.equal(ori);
                expect(win).to.equal(global);
                done();
            }, prefix);

            var fn = com._postMessage(ori, global, prefix);
            expect(fn).to.be.a('function');
            fn(obj);
        });
    });

});
