var hashData = require('../../src/lib/hashData.js');

var H = hashData.HASH_CHAR;
var P = hashData.PREFIX;
var S = hashData.SEPARATOR;

describe('Hash data', function () {
    var TESTID = 'testId';
    var INTERNAL = {key: 'testKey', origin: 'testLoc'};
    var PARAMS = {
        url:    'http://some.url/?with=query&string=true&andChars=æøå',
        width:  '100%',
        height: 100
    };

    var ENCODED_ID = H + P + S + TESTID + S + S;
    var ENCODED_ID_INT = H + P + S + TESTID + S +
            'key=testKey&origin=testLoc' + S;
    var ENCODED_ID_INT_PAR = ENCODED_ID_INT +
            'url=http%3A%2F%2Fsome.url%2F%3Fwith%3Dquery%26string%3Dtrue%26a' +
            'ndChars%3D%C3%A6%C3%B8%C3%A5&width=100%25&height=100';

    describe('encode', function () {
        it('should encode with only name', function () {
            expect(hashData.encode(TESTID)).toEqual( ENCODED_ID );
        });

        it('should encode with only name and internals', function () {
            expect(hashData.encode(TESTID, INTERNAL)).toEqual( ENCODED_ID_INT );
        });

        it('should encode with name, internals and params', function () {
            expect(hashData.encode(TESTID, INTERNAL, PARAMS)).toEqual( ENCODED_ID_INT_PAR );
        });
    });

    describe('decode', function () {
        it('should decode with only name', function () {
            var res = hashData.decode(ENCODED_ID);
            expect(res.id).toEqual(TESTID);
            expect(res.internal).toEqual({});
            expect(res.params).toEqual({});
        });

        it('should decode with name and internals', function () {
            var res = hashData.decode(ENCODED_ID_INT);
            expect(res.id).toEqual(TESTID);
            expect(res.internal).toEqual( INTERNAL );
            expect(res.params).toEqual({});
        });

        it('should decode with name, internals and params', function () {
            var res = hashData.decode(ENCODED_ID_INT_PAR);
            expect(res.id).toEqual(TESTID);
            expect(res.internal).toEqual( INTERNAL );
            for(var key in PARAMS) {
                expect(res.params[key]).toEqual(PARAMS[key].toString());
            }
        });

        it('should throw an error if the prefix is not included in hash', function(){
            var prefixLen = H.length + P.length;
            var urlStr = ENCODED_ID.substring(prefixLen);
            expect(function(){
                hashData.decode(urlStr);
            }).toThrow();
        });
    });
});