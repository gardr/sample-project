var express = require('express');
var app = express();
var PORT = 9966;

app.use(express.logger());

app.use(express.static(__dirname + '/public'));
app.use('/gardr', express.static(__dirname + '/gardr'));

app.get('/', function (req, res) {
    res.sendStatic('/public/index.html');
});

app.listen(PORT);
console.log('Server listening on http://localhost:'+PORT+'/\n');
