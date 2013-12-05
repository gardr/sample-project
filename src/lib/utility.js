var utility = {};

utility.on = function(name, elem, func) {
    if (elem.addEventListener) {
        elem.addEventListener(name, func, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + name, func);
    }
};

module.exports = utility;
