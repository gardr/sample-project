/* jshint maxlen: 99999 */
var utility = require('../../src/lib/utility.js');

describe('utility', function() {

    it('should be defined', function() {
        expect(utility).toEqual(jasmine.any(Object));
    });

    describe('extend', function(){
        var ext = utility.extend;

        expect(ext).toBeDefined();
        expect(ext({}));

        var expected = {a: 'a', b: 'b'};

        var input = ext({a: 'a'}, {b: 'b'});
        expect(input).toEqual(expected);

        input = ext({}, {a: '_'}, {b: '_'}, {a: 'a'}, {b: 'b'}, {});
        expect(input).toEqual(expected);
    });

    it('extendExcept', function(){

        var a = {'a':'a', 'not':'b'};
        var result = utility.extendExcept(['not'])({}, a);

        expect(result).toEqual(jasmine.any(Object));
        expect(result.not).toBeUndefined();
        expect(result.a).toEqual('a');


    });

    it('isFunction', function(){
        expect(utility.isFunction(function(){})).toBe(true);
        expect(utility.isFunction(false)).toBe(false);
    });

    it('isUndef', function(){
        expect(utility.isUndef()).toBe(true);
        expect(utility.isUndef(undefined)).toBe(true);
        expect(utility.isUndef(true)).toBe(false);
    });


    // it('isNodeList', function(){
    //     var nodeList = document.getElementsByTagName('*');
    //     console.log('nodeList', nodeList);
    //     expect(utility.isNodeList(nodeList)).toBe(true);
    // });

});
