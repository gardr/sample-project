var State = require('../../src/lib/state.js');

describe('state', function() {

    it('should be defined', function() {
        expect(State).toBeDefined();
    });

    it('creating a new state object', function(){

        var obj = State.create('someName');

        expect(obj).toEqual(jasmine.any(Object));
        expect(obj.id).toBeDefined();
        expect(obj.state).toBe(0);
    });

    it('should replace GARDR_UNIQUE_ID with a unique id', function () {
        var opts = {url: 'http://test.com/?misc=GARDR_UNIQUE_ID&foo=bar'};
        var url1 = State.create('test_unique', opts).getData().url;
        var url2 = State.create('test_unique2', opts).getData().url;
        expect(url1.indexOf('GARDR_UNIQUE_ID')).toEqual(-1);
        expect(url1).not.toEqual(url2.url);
    });

    it('should also replace PASTIES_UNIQUE_ID for backwards compatibility', function () {
        var opts = {url: 'http://test.com/?misc=PASTIES_UNIQUE_ID&foo=bar'};
        var url1 = State.create('test_unique', opts).getData().url;
        var url2 = State.create('test_unique2', opts).getData().url;
        expect(url1.indexOf('PASTIES_UNIQUE_ID')).toEqual(-1);
        expect(url1).not.toEqual(url2.url);
    });

    it('creating two states with same name should have unique ids', function () {
        expect(State.create('unique').id).not.toEqual(State.create('unique').id);
    });

});
