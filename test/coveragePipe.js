var glob = require('glob');
var fs = require('fs');
glob('coverage/*/*.info', {}, function (er, files) {
    fs.createReadStream(files[0]).pipe( process.stdout );
});
