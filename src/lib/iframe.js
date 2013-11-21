var com = require('./com.js');
var paramUtil = require('./paramUtil.js');

var VER = 1;
var TYPE = 'pasties';
var REFRESH_KEY = 'refresh-' + TYPE;
var FAILED_CLASS = TYPE + '-failed';
var SEPARATOR = '_|_';

function validWidth(v) {
    if (typeof v === 'string' && v.indexOf('px') !== -1) { return v; }
    if ( (typeof v === 'string' && v.indexOf('%') === -1) || typeof v === 'number') {
        return v + 'px';
    }
    return v;
}

function getOrigin(loc) {
    return loc.origin || (loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : ''));
}

function Iframe(name, options) {
    this.name = name;
    if (!options || typeof options.iframeUrl === 'undefined') {
        throw new Error('Iframe missing options and iframeUrl');
    }
    this.id = options.id || name + (+new Date());
    this.iframe = null;
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
    this.iframe = null;
    return this;
};

Iframe.prototype.resize = function(w, h) {
    if (w) { this.width = w; }
    if (h) { this.height = h; }
    this.iframe.style.width = validWidth(this.width);
    this.iframe.style.height = this.height + 'px';
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
    var sep = baseUrl.indexOf('?') !== -1 ? '&' : '?';
    var refresh = src && src.indexOf(REFRESH_KEY) === -1 ? REFRESH_KEY + '=true&' : '';
    return [
        baseUrl,
        sep,
        'ver=', VER,
        '&',
        refresh,
        // Wrapped args in predefined order
        '#',
        com.PREFIX,
        SEPARATOR,
        this.name,
        SEPARATOR, ['level=' + 1, 'key=' + this.key, 'origin=' + getOrigin(document.location)].join('&'),
        SEPARATOR,
        paramUtil.param(this.data)
    ].join('');
};

Iframe.prototype.refresh = function () {
    this.iframe.src = this._getUrl(this.iframe.src);
};

Iframe.prototype.makeIframe = function(data) {
    this.dataStr = paramUtil.param(data);
    var wrapper = this.wrapper = document.createElement('div');
    var i = this.iframe = document.createElement('iframe');
    var inner = document.createElement('div');
    var classes = [TYPE, TYPE + '-' + this.name];

    if (this.classes) {
        classes.push(this.classes);
    }
    if (this.hidden) {
        classes.push(TYPE + '-hidden');
        wrapper.style.display = 'none';
    }
    wrapper.id = this.id;
    wrapper.className = (classes.join(' ')).toLowerCase();
    wrapper.setAttribute('data-' + TYPE, this.name);
    i.setAttribute('data-automation-id', this.name);

    i.src = this._getUrl();
    i.className = TYPE + '-iframe';
    // IE 7-8
    i.marginWidth = 0;
    i.marginHeight = 0;
    i.frameBorder = '0';
    i.allowTransparency = 'true';
    // Safari will will not show iframe until scroll with width/height == 0px
    i.width = validWidth(this.width);
    i.height = this.height;
    i.style.width = validWidth(this.width);
    i.style.height = this.height + 'px';
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
