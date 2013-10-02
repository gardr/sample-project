var levelToText = {
    1: 'ERROR',
    2: 'WARN',
    3: 'INFO',
    4: 'DEBUG'
};
function log (logObj) {
	var level = levelToText[logObj.level];
	var str = [
		logObj.name,
        (logObj.time),
        level,
        logObj.msg,
    ].join(' ');
    global.console.log(str);
}

module.exports = log;