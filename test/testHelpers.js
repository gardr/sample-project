var Manager = require('../src/lib/manager.js');

function insertContainer(id){
    var elem = document.createElement('div');
    elem.id = id;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(elem);
    return elem;
}

function testableManager(options){
    options = options||{};
    options.iframeUrl = options.iframeUrl || 'about:blank';
    options.key = (+new Date() + Math.round(Math.random() * 1000)) + '_TEST';
    if (options.debug) {
        options.urlFragment = '#loglevel=debug&logto=console';
    }
    var man = new Manager(options);
    return man;
}

function getRandomNames(num){
    var list = [];
    while(num > 0){
        list.push(getRandomName());
        num --;
    }
    return list;
}

function getRandomName(){
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for( var i=0; i < 10; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + (+new Date());
}

function undefine(obj, prop) {
    var org = obj[prop];
    obj[prop] = undefined;
    return function restore() {
        obj[prop] = org;
    };
}

module.exports = {
    testableManager: testableManager,
    getRandomNames: getRandomNames,
    getRandomName: getRandomName,
    insertContainer: insertContainer,
    undefine: undefine
};
