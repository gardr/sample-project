var base = require('./karma.base.js');

module.exports = function (karma) {
    var obj = base(karma);

    obj.reporters = ['progress', 'coverage'];
    obj.coverageReporter = {
        reporters: [
            {
                type: 'lcovonly', // html not supported as files needs to be outputted to a folder
                dir: 'coverage/'
            },
            {
                type: 'text-summary'
            }
        ]
    };
    obj.browsers = ['PhantomJS'];
    obj.singleRun = true;
    obj.background = false;
    obj.colors = false;

    return karma.set(obj);
};
