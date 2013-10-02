var browserify = require('browserify-middleware');
var express = require('express');
var app = express();
var PORT = 9966;

app.use(express.logger());
app.get('/example_manager.js', browserify('./example_manager.js'));
app.get('/example_content.js', browserify('./example_content.js'));
app.get('/example_api.js', browserify('./example_api.js'));

app.use(express.static(__dirname + '/../target/pasties-js/'));
app.use(express.static(__dirname));

app.listen(PORT);
console.log('Server listening on http://localhost:'+PORT+'/');
