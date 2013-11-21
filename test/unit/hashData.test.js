var hashData = require('../../src/lib/hashData.js');

var H = hashData.HASH_CHAR;
var P = hashData.PREFIX;
var S = hashData.SEPARATOR;

describe('Hash data', function () {
    var TESTNAME = 'testName';
    var INTERNALS = {key: 'testKey', origin: 'testLoc'};
    var PARAMS = {
        url:    'http://some.url/?with=query&string=true&andChars=æøå',
        width:  '100%',
        height: 100
    };

    var ENCODED_NAME = H + P + S + TESTNAME + S + S;
    var ENCODED_NAME_INT = H + P + S + TESTNAME + S +
            'key=testKey&origin=testLoc' + S;
    var ENCODED_NAME_INT_PAR = ENCODED_NAME_INT +
            'url=http%3A%2F%2Fsome.url%2F%3Fwith%3Dquery%26string%3Dtrue%26a' +
            'ndChars%3D%C3%A6%C3%B8%C3%A5&width=100%25&height=100';

    describe('encode', function () {
        it('should encode with only name', function () {
            expect(hashData.encode(TESTNAME)).toEqual( ENCODED_NAME );
        });

        it('should encode with only name and internals', function () {
            expect(hashData.encode(TESTNAME, INTERNALS)).toEqual( ENCODED_NAME_INT );
        });

        it('should encode with name, internals and params', function () {
            expect(hashData.encode(TESTNAME, INTERNALS, PARAMS)).toEqual( ENCODED_NAME_INT_PAR );
        });
    });

    describe('decode', function () {
        it('should decode with only name', function () {
            var res = hashData.decode(ENCODED_NAME);
            expect(res.name).toEqual(TESTNAME);
            expect(res.internals).toEqual({});
            expect(res.params).toEqual({});
        });

        it('should decode with name and internals', function () {
            var res = hashData.decode(ENCODED_NAME_INT);
            expect(res.name).toEqual(TESTNAME);
            expect(res.internals).toEqual( INTERNALS );
            expect(res.params).toEqual({});
        });

        it('should decode with name, internals and params', function () {
            var res = hashData.decode(ENCODED_NAME_INT_PAR);
            expect(res.name).toEqual(TESTNAME);
            expect(res.internals).toEqual( INTERNALS );
            for(var key in PARAMS) {
                expect(res.params[key]).toEqual(PARAMS[key].toString());
            }
        });

        it('should throw an error if the prefix is not included in hash', function(){
            var prefixLen = H.length + P.length;
            var urlStr = ENCODED_NAME.substring(prefixLen);
            expect(function(){
                hashData.decode(urlStr);
            }).toThrow();
        });
    });
});