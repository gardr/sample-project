var com = require('./com.js');
var hashData = require('./hashData.js');

var VER = 1;
var TYPE = 'gardr';
var REFRESH_KEY = 'refresh-' + TYPE;
var FAILED_CLASS = TYPE + '-failed';
var SEPARATOR = '_|_';

function validSize(v) {
    if (typeof v === 'string' && v.indexOf('px') !== -1) { return v; }
    if ( (typeof v === 'string' && v.indexOf('%') === -1) || typeof v === 'number') {
        return v + 'px';
    }
    return v;
}

function getOrigin(loc) {
    return loc.origin || (loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : ''));
}

function Iframe(id, options) {
    this.id = id;
    if (!options || typeof options.iframeUrl === 'undefined') {
        throw new Error('Iframe missing options and iframeUrl');
    }
    this.element = null;
    this.iframeUrl = options.iframeUrl;
    this.width = options.width || '100%';
    this.height = options.height || '100px';
    this.classes = options.classes || '';
    this.hidden = options.hidden;
    this.data = {};
    this.key = options.key || com.PARENT_PREFIX;
}

Iframe.prototype.SEPARATOR = SEPARATOR;
Iframe.prototype.remove = function() {
    this.wrapper.parentNode.removeChild(this.wrapper);
    this.wrapper = null;
    this.element = null;
    return this;
};

Iframe.prototype.resize = function(w, h) {
    if (w) { this.width = w; }
    if (h) { this.height = h; }
    this.element.style.width = validSize(this.width);
    this.element.style.height = validSize(this.height);
    return this;
};

Iframe.prototype.addFailedClass = function() {
    var val;
    if (this.wrapper && ((val = this.wrapper.className.indexOf()) === -1)) {
        this.wrapper.className = val + ' ' + FAILED_CLASS;
    }
};

Iframe.prototype.setData = function (data) {
    this.data = data;
};

Iframe.prototype._getUrl = function(src) {
    var baseUrl = this.iframeUrl;
    if (typeof baseUrl != 'string') {
        throw new Error('iframeUrl must be a string');
    }
    var sep = baseUrl.indexOf('?') !== -1 ? '&' : '?';
    var refresh = src && src.indexOf(REFRESH_KEY) === -1 ? REFRESH_KEY + '=true&' : '';
    return [
        baseUrl,
        sep,
        'ver=', VER,
        '&',
        refresh,
        // Wrapped args in predefined order
        hashData.encode(this.id, {key: this.key, origin: getOrigin(document.location)}, this.data)
    ].join('');
};

Iframe.prototype.refresh = function () {
    this.element.src = this._getUrl(this.element.src);
};

Iframe.prototype.makeIframe = function() {
    var wrapper = this.wrapper = document.createElement('div');
    var i = this.element = document.createElement('iframe');
    var inner = document.createElement('div');
    var classes = [TYPE, TYPE + '-' + this.id];

    if (this.classes) {
        classes.push(this.classes);
    }
    if (this.hidden) {
        classes.push(TYPE + '-hidden');
        wrapper.style.display = 'none';
    }
    //wrapper.id = this.id;
    wrapper.className = (classes.join(' ')).toLowerCase();
    wrapper.setAttribute('data-' + TYPE, this.id);
    i.setAttribute('data-automation-id', this.id);

    i.src = this._getUrl();
    i.className = TYPE + '-iframe';
    // IE 7-8
    i.marginWidth = 0;
    i.marginHeight = 0;
    i.frameBorder = '0';
    i.allowTransparency = 'true';
    // Safari will will not show iframe until scroll with width/height == 0px
    //i.width = validSize(this.width);
    //i.height = this.height;
    i.style.width = validSize(this.width);
    i.style.height = validSize(this.height);
    i.style.border = '0';
    i.style.display = 'block';
    // stop scroll
    i.style.overflow = 'hidden';
    i.scrolling = 'no';



    inner.appendChild(i);
    inner.className = TYPE + '-inner';
    wrapper.appendChild(inner);
    return this;
};

module.exports = Iframe;
