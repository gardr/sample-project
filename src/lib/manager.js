/* jshint maxparams:4 */
'use strict';
var State = require('./state.js');
var utility = require('./utility.js');
var Iframe = require('./iframe.js');
var com = require('./com.js');
var support = require('./support.js');
var paramUtil = require('./paramUtil.js');
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
    var params = paramUtil.deparam(hash.replace(/^#/, ''));
    if (params.loglevel) {
        return parseInt(params.loglevel, 10);
    }
    return 0;
}

function getLogTo(hash) {
    hash = hash || '';
    var params = paramUtil.deparam(hash.replace(/^#/, ''));
    return params.logto;
}

function Manager(options) {
    this.items = {};
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

        var item = manager._get(msg.name);

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
        this._fail(msg.name, msg);
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
        item.input.width = msg.r ? '100%' : msg.w;
        item.input.height = msg.h;
        item.input.responsive = msg.r;
        if (item.ignoreResize !== true) {
            item.iframe.resize(item.input.width, item.input.height);
        }
        this._resolve(msg.name);
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
        utility.extend(this.__inject, o);
    }
};

proto._get = function (name) {
    return this.items[name];
};

proto._getConfig = function (name) {
    return this.itemConfigs[name];
};

proto.config = function (name, configData) {
    // TODO object as name is a fallback for backwards compatibility.
    // remove when implementations are updated.
    if (typeof name === 'object' && name.name) {
        configData = name;
    } else if (typeof name === 'string') {
        configData.name = name;
    }

    this._addToConfigMap(configData);
};

/* Add data. "Queue" banner for render. */
proto.queue = function (obj) {
    if (utility.isArray(obj)) {
        //this.log(2, 'Queued ' + obj.length + ' positions');
        var self = this;
        obj.forEach(function (v) {
            self._addToMap.call(self, v);
        });
    } else {
        //this.log(2, 'Queued ' + obj.name + '.');
        this._addToMap(obj);
    }
};

proto._addToConfigMap = function(obj){
    if (!obj || !obj.name) {
        throw new Error('Missing name on configuration object');
    }

    this.itemConfigs[obj.name] = obj;
    return obj;
};

proto._addToMap = function (input) {
    if (!input || !input.name) {
        throw new Error('Missing name on configuration object');
    }
    var config = this._getConfig(input.name);
    var item = State.create(input.name);
    this.items[input.name] = utility.extend(item, config, input);
};

proto._setCallback = function(name, cb) {
    var list = this.callbacks[name];
    if (!utility.isArray(this.callbacks[name])) {
        list = this.callbacks[name] = [];
    }
    if (utility.isFunction(cb)) {
        list.push(cb);
    }
    // console.log('name:', name, 'cb', !!cb, 'list:', this.callbacks[name], 'all:', this.callbacks);
};

/* Insert iframe into page. */
proto.render = function (name, cb) {
    //console.log('render()- '+name);
    var item = this._get(name);

    this._setCallback(name, cb);
    if (!item) {
        return this._resolve(name, new Error(name + ' missing item'));
    }
    if (!item.container || !item.url) {
        item.set(State.INCOMPLETE);
        return this._resolve(name, new Error(name + ' missing queued config'));
    }

    if (utility.isString(item.container)) {
        item.container = document.getElementById(item.container);
        if (!item.container) {
            return this._resolve(name, new Error(name + ' missing container'));
        }
    }

    this.createIframe(item);

    if (item.isActive()) {
        if (item.isResolved()) {
            this._resolve(name, null, true);
        }
    } else {
        item.set(State.ACTIVE);
        item.container.appendChild(item.iframe.wrapper);

    }
    return item;
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
    return utility.extend(item.getData(), this.__inject);
};

proto.createIframe = function (item) {
    if (!item.iframe) {
        // todo, check if actually iframe is on different domain
        item.iframe = new Iframe(item.name, {
            iframeUrl: (
                support.hasCrossDomainFrameSupport(
                    this.options.deactivateCDFS) ? this.options.iframeUrl : this.options.sameDomainIframeUrl
            ),
            key: this.key,
            width: item.width,
            height: item.height,
            id: item.id,
            hidden: item.hidden,
            classes: ''
        });

        item.iframe.setData( this._getItemData(item) );
        item.iframe.makeIframe();
    }
};

proto._runCallbacks = function(name, args) {
    var list = this.callbacks[name] || [];
    this.callbacks[name] = [];
    list.filter(utility.isFunction).forEach(function(fn) {
        fn.apply(global, args);
    });

    if (name !== ALL && this.callbacks[ALL] && this._checkResolvedStatus()) {
        this._runCallbacks(ALL, [args[0], this.items]);
    }
};

proto._resolve = function(name, error, ignoreNewState, type) {
    type = type||'done';
    var item = this._get(name);

    if (item && ignoreNewState !== true) {
        item.rendered++;
        item.set(State.RESOLVED);
    }
    if (item && utility.isFunction(item[type])){
        item[type](error, item);
    }
    if (item && item.isResolved()) {
        this._runCallbacks(name, [error, item]);
    }
};

proto._fail = function (name, obj){
    var item = this._get(name);
    if (item){
        item.set(State.FAILED);
    }
    this._resolve(name, obj && obj.message, true, 'fail');
};

proto._checkResolvedStatus = function() {
    var self = this;
    var itemList = Object.keys(this.items).map(function (name) {
        return self.items[name];
    });

    return itemList.every(function (item) {
        return item.isResolved();
    });
};

proto._renderUntouched = function () {
    for (var key in this.items) {
        if (this.items[key].isActive() === false) {
            this.render(key);
        }
    }
};

proto._refreshUntouched = function() {
    for (var key in this.items) {
        if (this.items[key].needsRefresh() === true) {
            this.refresh(key);
        }
    }
};

proto.refresh = function(name, cb) {
    var item = this._get(name);
    if (!item) { return cb(new Error('Missing config '+name)); }
    if (item.isUsable()) {
        this._setCallback(name, cb);
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
        this._fail(name);
    }
};

proto._forEachItem = function (fn) {
    var manager = this;
    Object.keys(this.items).map(function (name) {
        return manager._get(name);
    }).forEach(fn);
};

proto.refreshAll = function(prioritized, cb) {
    if (utility.isFunction(prioritized)) {
        cb = prioritized;
        prioritized = undefined;
    }
    this._setCallback(ALL, cb);

    prioritized = commaStringToArray(prioritized);

    this._forEachItem(function (item) {
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