var extend = require('util-extend');
/*
    Banner state
        - communicated via manager via com.js
*/
var STATES = {
    CREATED: 0,
    REMOVED: 1,
    NEEDS_REFRESH: 2,
    DESTROYED: 3,

    ACTIVE: 10,
    REACTIVATED: 11,
    REFRESHING: 12,

    FAILED: 20,
    TIMED_OUT: 21,
    REJECTED: 22,
    /* NOT_VALID */
    INCOMPLETE: 23,
    /* RESIZED: 24, */

    RESOLVED: 30
};

var DEFAULTS = {
    retries: 5,
    timeout: 200,
    minSize: 39,
    rendered: 0,
    state: STATES.CREATED,
    input: {},
    name: null,
    url: null,
    width: null,
    height: null,
    iframe: null,
    container: null
};
var UNIQUE_TOKEN_REGEX = /(GARDR|PASTIES)_UNIQUE_ID/g;
var uniqueCount = 0;

function State(name, options) {
    extend( extend(this, DEFAULTS), options);
    this.name = name;
    this.id = name + (++uniqueCount);
}

extend(State, STATES);
var proto = State.prototype;

proto.isActive = function() {
    return this.state >= 10;
};

proto.isResolved = function() {
    return this.state >= 30;
};

proto.isUsable = function() {
    return this.state !== State.REJECTED && this.state !== State.INCOMPLETE;
};

proto.needsRefresh = function () {
    return this.state === State.NEEDS_REFRESH;
};

var FAILED_MAX =  29;
proto.hasFailed = function(){
    return this.isActive() && this.state >= State.FAILED && this.state <= FAILED_MAX;
};

proto.set = function(input) {
    this.lastState = this.state;
    this.state = (typeof input == 'number') ? input : State[input];
};

proto.getData = function() {

    var url = this.url;
    if (url && UNIQUE_TOKEN_REGEX.test(url)) {
        url = url.replace(UNIQUE_TOKEN_REGEX, '' + new Date().getTime() + (this.id));
    }

    return {
        name: this.name,
        minSize: this.minSize,
        timeout: this.timeout,
        url: url,
        width: this.width,
        height: this.height
    };
};

State.create = function(name, options) {
    return new State(name, options);
};

module.exports = State;
