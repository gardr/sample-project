var express = require('express');
var serveStatic = require('serve-static')
var app = express();
var PORT = 9966;

app.use(require('morgan')('combined'));

app.use(serveStatic(__dirname + '/public'));
app.use('/gardr', serveStatic(__dirname + '/gardr'));

app.get('/', function (req, res) {
    res.sendStatic('/public/index.html');
});

app.listen(PORT);
console.log('Server listening on http://localhost:'+PORT+'/\n');
