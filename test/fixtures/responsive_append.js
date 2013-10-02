/* jshint evil: true */
var el = document.createElement('DIV');
el.setAttribute('style', 'width:100%;height:100%;background:green;color:white;');
el.setAttribute('data-responsive', '225h');
el.innerHTML = '<h1>Appended to body</h1>';

var body = document.getElementById('PASTIES');
if (body){
    body.appendChild(el);
}
