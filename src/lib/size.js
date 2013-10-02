module.exports = function(element) {
    // TODO, get real size on element.
    var size = element.getBoundingClientRect();

    return {
        width: Math.round(element.offsetWidth || size.width),
        height: Math.round(element.offsetHeight || size.height)
    };
};
