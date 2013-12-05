/* jshint maxlen: 99999 */
var utility = require('../../src/lib/utility.js');

describe('utility', function() {

    it('should be defined', function() {
        expect(utility).toEqual(jasmine.any(Object));
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
