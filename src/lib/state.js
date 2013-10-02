var utility = require('./utility');
/*
    Banner state
        - communicated via manager via com.js
*/
var internals = {
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
    state: internals.CREATED,
    input: {},
    name: null,
    url: null,
    width: null,
    height: null
};
var UNIQUE_TOKEN_REGEX = /PASTIES_UNIQUE_ID/g;
var uniqueCount = 0;

function generateUniqueId() {
    return '' + new Date().getTime() + (uniqueCount++);
}

function State(name, options) {
    utility.extend(this, DEFAULTS, options);
    this.name = name;
}

var proto = State.prototype;

proto.isActive = function() {
    return this.state >= 10;
};

proto.isResolved = function() {
    return this.state >= 30;
};

proto.isUsable = function() {
    return this.state !== internals.REJECTED && this.state !== internals.INCOMPLETE;
};

proto.needsRefresh = function () {
    return this.state === internals.NEEDS_REFRESH;
};

var FAILED_MAX =  29;
proto.hasFailed = function(){
    return this.isActive() && this.state >= internals.FAILED && this.state <= FAILED_MAX;
};

proto.set = function(input) {
    this.lastState = this.state;
    this.state = utility.isNumber(input) ? input : internals[input];
};

proto.getData = function() {

    var url = this.url;
    if (url && UNIQUE_TOKEN_REGEX.test(url)) {
        url = url.replace(UNIQUE_TOKEN_REGEX, generateUniqueId());
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

internals.create = function(name, options) {
    return new State(name, options);
};



internals.State = State;

module.exports = internals;
