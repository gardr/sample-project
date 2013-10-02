module.exports = function (type, extra) {
    var event = document.createEvent('CustomEvent');
    event.initEvent(type, false, true);
    for (var key in (extra || {})) {
        event[key] = extra[key];
    }
    return event;
};