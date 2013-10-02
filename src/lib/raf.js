/*
    iOS rAF requestAnimationFrame shim.

    Need to replace raf to get requestAnimationFrame to work in parent page.
*/

module.exports = function () {
    var lastTime = 0;

    function setRaf(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    }

    function clearRAf(id) {
        clearTimeout(id);
    }

    window.webkitRequestAnimationFrame = setRaf;
    window.requestAnimationFrame = setRaf;

    window.webkitCancelAnimationFrame = clearRAf;
    window.webkitCancelRequestAnimationFrame = clearRAf;
    window.cancelRequestAnimationFrame = clearRAf;
    window.cancelAnimationFrame = clearRAf;

};
