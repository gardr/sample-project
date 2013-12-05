/* jshint maxparams:4 */
'use strict';
var State = require('./state.js');
var utility = require('./utility.js');
var extend = require('util-extend');
var Iframe = require('./iframe.js');
var com = require('./com.js');
var support = require('./support.js');
var queryParams = require('query-params');
var ALL = '__all';
//var windowSize = require('window-size');
/*
    Parent page "api"

    Inject
        - Logger
        - EventEmitter
        - com.js
*/

function getLogLevel(hash) {
    hash = hash || '';
    var params = queryParams.decode(hash.replace(/^#/, ''));
    if (params.loglevel) {
        return parseInt(params.loglevel, 10);
    }
    return 0;
}

function getLogTo(hash) {
    hash = hash || '';
    var params = queryParams.decode(hash.replace(/^#/, ''));
    return params.logto;
}

function addItemCallback (item, callback) {
    if (typeof callback != 'function') {
        return;
    }
    item._callbacks = item._callbacks || [];
    item._callbacks.push(callback);
}

function getItemCallbacks (item) {
    return item._callbacks || [];
}

function Manager(options) {
    this.items = [];
    this.itemConfigs = {};

    this.key = options && options.key||com.PARENT_PREFIX;
    this.callbacks = {};
    this.options = options || {};
    this.__inject = {};
    if (this.options.deactivateCDFS === true) {
        this.__inject.cdfs = this.options.deactivateCDFS;
    }

    this.flags = {};
    this.logLevel = getLogLevel(this.options.urlFragment);
    this.logTo = getLogTo(this.options.urlFragment);

    if (this.logLevel > 0) {
        this.__inject.loglevel=this.logLevel;
        if (this.logTo)  { this.__inject.logto=this.logTo; }
    }

    // TODO: remove this fallbacks
    if (!this.options.iframeUrl) {
        this.options.iframeUrl = 'about:blank';
    }
    if (!this.options.sameDomainIframeUrl) {
        this.options.sameDomainIframeUrl = this.options.iframeUrl;
    }

    var manager = this;

    /*
        (ios-fix) backbutton cache buster, reload all ads.
    */
    utility.on('pageshow', global, function(e){
        if(e.persisted === true){
            /*
                TODO: Need to refactor lastOrder/priority to live in
                configuration instead, e.g. { name..., dependOn: ['top', 'top_ipad'] }
            */
            manager.refreshAll(this.lastOrder);
        }
    });

    // this.sharedState = {};
    com.incomming(function (msg, contentWindow, origin) {
        var item = manager._getById(msg.id);
        if (!item || item.isActive() !== true) {
            return;
        }
        if (item && !item.com) {
            // create a communication channel back
            item.com = com.createOutgoing(origin, contentWindow, com.PREFIX);
        }
        manager._delegate(msg, item);
    }, this.key, this.options.deactivateCDFS);
}
Manager._ALL = ALL;
var proto = Manager.prototype;

proto._delegate = function (msg, item) {
    switch (msg.cmd) {
    case 'set':
        item.com({
            result: (this.flags[msg.key] = msg.value),
            cmd: 'callback',
            index: msg.index
        });
        break;
    case 'fail':
        item.iframe.addFailedClass();
        this._fail(msg.id, msg);
        break;
    case 'get':
        item.com({
            result: this.flags[msg.key],
            cmd: 'callback',
            index: msg.index
        });
        break;
    case 'sizes':
        // TODO refactor out and test. check if minsize
        // check if minsize
        item.input.width = msg.w;
        item.input.height = msg.h;
        this._resolve(msg.id);
        break;
    case 'debug':
        this.debug = this.debug||[];
        this.debug.push(msg);
        break;

    default:
        if (global.console) {
            global.console.log('Missing action for', msg.cmd, msg);
        }
        break;

    }
};

proto.extendInframeData = function (o) {
    if (o) {
        extend(this.__inject, o);
    }
};

proto._get = function (name) {
    return this.items.filter(function(item){
        return item.name === name;
    });
};

proto._getById = function(id) {
    for(var i=0, l=this.items.length; i<l; i++) {
        if (this.items[i].id === id) { return this.items[i]; }
    }
};

proto._getConfig = function (name) {
    return this.itemConfigs[name];
};

proto.config = function (name, configData) {
    this.itemConfigs[name] = configData || {};
};

/* Add data. "Queue" banner for render. */
proto.queue = function (name, obj) {
    var input = obj || {};
    if (!name) {
        throw new Error('Can\'t queue without a name');
    }
    var config = this._getConfig(name) || {};
    if (!config.container && !input.container) {
        //throw new Error('Can\'t queue without a container');
        input.container = document.body.appendChild( document.createElement('div') );
    }
    var item = State.create(name);
    this.items.push( extend( extend(item, config), input) );
};

/* Insert iframe into page. */
proto.render = function (name, cb) {

    this._forEachWithName(name, function (item) {
        addItemCallback(item, cb);

        if (!item) {
            return this._resolve(item.id, new Error(name + ' missing item'));
        }
        if (!item.container || !item.url) {
            item.set(State.INCOMPLETE);
            return this._resolve(item.id, new Error(name + ' missing queued config'));
        }

        if (utility.isString(item.container)) {
            item.container = document.getElementById(item.container);
            if (!item.container) {
                return this._resolve(item.id, new Error(name + ' missing container'));
            }
        }

        this.createIframe(item);

        if (item.isActive()) {
            if (item.isResolved()) {
                this._runCallbacks(item, [null, item]);
            }
        } else {
            item.set(State.ACTIVE);
            item.container.appendChild(item.iframe.wrapper);

        }
        //return item;
    });
};

function commaStringToArray(list) {
    if (!utility.isString(list)) {
        return [];
    }
    return list.split(',');
}

proto.renderAll = function(prioritized, cb) {
    if (utility.isFunction(prioritized)) {
        cb = prioritized;
        prioritized = undefined;
    }
    this.lastOrder = prioritized;
    this._setCallback(ALL, cb);

    prioritized = commaStringToArray(prioritized);

    var manager = this;
    function loop() {
        if (prioritized.length > 0) {
            manager.render(prioritized.shift(), loop);
        } else {
            manager._renderUntouched();
        }
    }
    loop();
};

proto._getItemData = function (item) {
    return extend(item.getData(), this.__inject);
};

proto.createIframe = function (item) {
    if (!item.iframe) {
        // todo, check if actually iframe is on different domain
        item.iframe = new Iframe(item.id, {
            iframeUrl: (
                support.hasCrossDomainFrameSupport(
                    this.options.deactivateCDFS) ? this.options.iframeUrl : this.options.sameDomainIframeUrl
            ),
            key: this.key,
            width: item.width,
            height: item.height,
            hidden: item.hidden,
            classes: ''
        });

        item.iframe.setData( this._getItemData(item) );
        item.iframe.makeIframe();
    }
};

proto._setCallback = function(name, cb) {
    var list = this.callbacks[name];
    if (!this.callbacks[name]) {
        list = this.callbacks[name] = [];
    }
    if (utility.isFunction(cb)) {
        list.push(cb);
    }
};

proto._runCallbacks = function(item, args) {
    // TODO test callback id/name issues
    var list, id;
    if (typeof item == 'object') {
        list = getItemCallbacks(item);
    } else if (item === ALL) {
        id = ALL;
        list = this.callbacks[id] || [];
    }
    var length = list.length;
    while (length > 0) {
        list.shift().apply(global, args);
        length--;
    }

    if (id !== ALL && this.callbacks[ALL] && this._checkResolvedStatus()) {
        this._runCallbacks(ALL, [args[0], this.items]);
    }
};

proto._resolve = function(id, error, ignoreNewState) {
    var type = 'done';
    if (error) { type = 'fail'; }

    var item = this._getById(id);
    if (item && ignoreNewState !== true) {
        item.rendered++;
        item.set(State.RESOLVED);
    }
    if (item && utility.isFunction(item[type])){
        item[type](error, item);
    }
    if (item && item.isResolved()) {
        this._runCallbacks(item, [error, item]);
    }
};

proto._fail = function (id, obj){
    var item = this._getById(id);
    if (item){
        item.set(State.FAILED);
    }
    this._resolve(id, new Error(obj.message), true);
};

proto._checkResolvedStatus = function() {
    return this.items.every(function (item) {
        return item.isResolved();
    });
};

proto._forEachItem = function (fn) {
    this.items.forEach(fn.bind(this));
};

proto._forEachWithName = function (name, fn) {
    this._get(name).forEach(fn.bind(this));
};

proto._renderUntouched = function () {
    this._forEachItem(function(item){
        if ( item.isActive() === false ){
            this.render(item.name);
        }
    });
};

proto._refreshUntouched = function() {
    this._forEachItem(function(item){
        if ( item.needsRefresh() === true ){
            this.refresh(item.name);
        }
    });
};

proto.refresh = function(name, cb) {
    this._forEachWithName(name, function (item) {
        addItemCallback(item, cb);
        if (!item) { return cb(new Error('Missing config ' + name)); }
        if (item.isUsable()) {
            item.iframe.setData( this._getItemData(item) );
            item.set(State.REFRESHING);
            try{
                item.iframe.refresh();
            } catch(err){
                item.iframe = null;
                item.set(item.DESTROYED);
                // reset:
                this.render(name, cb);
            }
        } else {
            // todo: change to failed with master merge, + add test
            this._resolve(item.id, new Error('item is not usable'));
        }
    });
};

proto.refreshAll = function(prioritized, cb) {
    if (utility.isFunction(prioritized)) {
        cb = prioritized;
        prioritized = undefined;
    }
    this._setCallback(ALL, cb);

    prioritized = commaStringToArray(prioritized);

    this._forEachItem(function(item){
        item.set(State.NEEDS_REFRESH);
    });

    var manager = this;
    function loop() {
        if (prioritized.length > 0) {
            manager.refresh(prioritized.shift(), loop);
        } else {
            manager._refreshUntouched();
        }
    }
    loop();
};

module.exports = Manager;
