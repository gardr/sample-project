var express = require('express');
var app = express();
var PORT = 9966;

app.engine('hjs', require('hogan-express'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.logger());

app.use(express.static(__dirname + '/public'));
app.use('/browserified', express.static(__dirname + '/browserified'));

app.get('/', function (req, res) {
    res.render('index', { bannerUrl: req.query.bannerUrl });
});

app.listen(PORT);
process.stdout.write('Server listening on http://localhost:'+PORT+'/\n');
