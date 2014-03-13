var Iframe = require('../../src/lib/iframe.js');
var callback;
IframeMock = function () {
	Iframe.apply(this, arguments);
};
IframeMock.prototype = new Iframe('id', {iframeUrl: 'a'});
IframeMock.prototype._createIframeElement = function () {
	return document.createElement('iframemock');
};

['makeIframe', 'refresh'].forEach(function (key) {
	IframeMock.prototype[key] = function () {
		var ret = Iframe.prototype[key].apply(this, arguments);
		if (callback) {
			setTimeout(function () {
				callback(this);
			}.bind(this),0);
		}
		return ret;
	};
});

IframeMock.onLoad = function (cb) {
	callback = cb;
};
module.exports = IframeMock;