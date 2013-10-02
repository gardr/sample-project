/* jshint maxparams:4 */
'use strict';
var state = require('./state.js');
var utility = require('./utility.js');
var Iframe = require('./iframe.js').Iframe;
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

        var item = manager.get(msg.name);

        if (!item || item.isActive() !== true) {
            return;
        }
        if (item && !item.com) {
            // create a communication channel back
            item.com = com.createOutgoing(origin, contentWindow, com.PREFIX);
        }
        manager.delegate(msg, item);
    }, this.key, this.options.deactivateCDFS);
}
var proto = Manager.prototype;

proto.delegate = function (msg, item) {
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
        this.fail(msg.name, msg);
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
        this.resolve(msg.name);
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

proto.log = function ( /*level, message*/ ) {
    /*this.logs = this.logs || [];
    this.logs.push({
        time: new Date(),
        level: level,
        message: message
    });*/
};

proto.getOrCreate = function (name) {
    this.items[name] = this.items[name] || state.create(name);
    return this.items[name];
};

proto.get = function (name) {
    return this.items[name];
};

proto.config = function (name, key, value) {
    if (utility.isString(key)) {
        this.getOrCreate(name)[key] = value;
    } else if (typeof name === 'object') {
        this.addToMap(name);
    }
    //this.log(name, key, value);
    return this;
};

/* Add data. "Queue" banner for render. */
proto.queue = function (obj) {
    if (utility.isArray(obj)) {
        //this.log(2, 'Queued ' + obj.length + ' positions');
        var self = this;
        obj.forEach(function (v) {
            self.addToMap.call(self, v);
        });
    } else {
        //this.log(2, 'Queued ' + obj.name + '.');
        this.addToMap(obj);
    }
    return this;
};

proto.addToMap = function (input) {
    if (!input || !input.name) {
        throw new Error('Missing name on configuration object');
    }
    var item = this.get(input.name);
    if (!item && input.multiple === true) {
        this.items[input.name] = {
            name: input.name,
            items: [],
            multiple: true,
            _input: input
        };
        return this.items[input.name];
    }

    state.create(name);

    item = this.getOrCreate(input.name, input);
    if (item.items) {
        var subName = input.name + '_' + item.items.length;
        var subItem = this.getOrCreate(subName);
        utility.extendExcept(['multiple', 'name'])(subItem, item._input, input);
        item.items.push(subItem);
        return subItem;
    } else {
        return utility.extend(item, input);
    }
};

proto.setCallback = function(name, cb) {
    var list = this.callbacks[name];
    if (!utility.isArray(this.callbacks[name])) {
        list = this.callbacks[name] = [];
    }
    if (utility.isFunction(cb)) {
        list.push(cb);
    }
    // console.log('name:', name, 'cb', !!cb, 'list:', this.callbacks[name], 'all:', this.callbacks);
};

function renderMultiple(item, cb, manager){
    var len = item.items.length;
    var err;
    item.items.forEach(function(subItem) {
        manager.render(subItem.name, function(_err) {
            len--;
            if (_err) { err = _err; }
            if (len <= 0) {
                cb(err, item);
            }
        });
    });
    return item;
}

/* Insert iframe into page. */
proto.render = function (name, cb) {
    //console.log('render()- '+name);
    var item = this.get(name);

    if (item && item.items) {
        return renderMultiple(item, cb, this);
    }

    this.setCallback(name, cb);
    if (!item) {
        return this.resolve(name, new Error(name + ' missing item'));
    }
    if (!item.container || !item.url) {
        item.set(state.INCOMPLETE);
        return this.resolve(name, new Error(name + ' missing queued config'));
    }

    if (utility.isString(item.container)) {
        item.container = document.getElementById(item.container);
        if (!item.container) {
            return this.resolve(name, new Error(name + ' missing container'));
        }
    }

    this.createIframe(item);

    if (item.isActive()) {
        if (item.isResolved()) {
            this.resolve(name, null, true);
        }
    } else {
        item.set(state.ACTIVE);
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
    this.setCallback(ALL, cb);

    prioritized = commaStringToArray(prioritized);

    var manager = this;
    function loop() {
        if (prioritized.length > 0) {
            manager.render(prioritized.shift(), loop);
        } else {
            manager.renderUntouched();
        }
    }
    loop();
};

proto.getItemData = function (item) {
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

        item.iframe.setData( this.getItemData(item) );
        item.iframe.makeIframe();
    }
};

proto._runCallbacks = function(name, args) {
    var list = this.callbacks[name] || [];
    this.callbacks[name] = [];
    list.filter(utility.isFunction).forEach(function(fn) {
        fn.apply(global, args);
    });

    if (name !== ALL && this.callbacks[ALL] && this.__checkResolvedStatus()) {
        this._runCallbacks(ALL, [args[0], this.items]);
    }
};

proto.resolve = function(name, error, ignoreNewState, type) {
    type = type||'done';
    var item = this.get(name);

    if (item && ignoreNewState !== true) {
        item.rendered++;
        item.set(state.RESOLVED);
    }
    if (item && utility.isFunction(item[type])){
        item[type](error, item);
    }
    this._runCallbacks(name, [error, item]);
};

proto.fail = function (name, obj){
    var item = this.get(name);
    if (item){
        item.set(state.FAILED);
    }
    this.resolve(name, obj && obj.message, true, 'fail');
};

proto.__checkResolvedStatus = function() {
    var self = this;
    var itemList = Object.keys(this.items).map(function (name) {
        return self.items[name];
    });

    return itemList.every(function (item) {
        return item.isResolved();
    });
    /*var allIsResolved = true;
    var item;
    for (var key in this.items) {
        item = this.items[key];
        // TODO: need to check items.item.items for multiple.
        // TODO is this the same? state needs to be looked at....
        // if (item.resolved !== true && item.incomplete !== true){
        if (!item.isResolved()) {
            allIsResolved = false;
            break;
        }
    }
    // console.log('ALL IS RESOLVED:' + allIsResolved);
    return allIsResolved;*/
};

proto.renderUntouched = function () {
    for (var key in this.items) {
        if (this.items[key].isActive() === false) {
            this.render(key);
        }
    }
};

proto.refreshUntouched = function() {
    for (var key in this.items) {
        if (this.items[key].needsRefresh() === true) {
            this.refresh(key);
        }
    }
};

proto.refresh = function(name, cb) {
    var item = this.get(name);
    if (!item) { return cb(new Error('Missing config '+name)); }
    if (item.isUsable()) {
        this.setCallback(name, cb);
        item.iframe.setData( this.getItemData(item) );
        item.set(state.REFRESHING);
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
        this.fail(name);
    }
};

proto.forEachItem = function (fn) {
    var manager = this;
    Object.keys(this.items).map(function (name) {
        return manager.get(name);
    }).forEach(fn);
};

proto.refreshAll = function(prioritized, cb) {
    if (utility.isFunction(prioritized)) {
        cb = prioritized;
        prioritized = undefined;
    }
    this.setCallback(ALL, cb);

    prioritized = commaStringToArray(prioritized);

    this.forEachItem(function (item) {
        item.set(state.NEEDS_REFRESH);
    });

    var manager = this;
    function loop() {
        if (prioritized.length > 0) {
            manager.refresh(prioritized.shift(), loop);
        } else {
            manager.refreshUntouched();
        }
    }
    loop();
};

proto.pluginHandler = function ( /*name, data, plug*/ ) {
    //var item = this.get(name);

};

module.exports = {
    Manager: Manager
};
