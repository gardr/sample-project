var base = require('./karma.base.js');

module.exports = function (karma) {
    var obj = base(karma);

    obj.junitReporter =  { outputFile: 'target/surefire-reports/karma-test-results.xml' };
    obj.reporters     =  ["junit"];
    obj.singleRun     = true;
    obj.background    = false;
    obj.colors        = false;
    obj.logLevel      = karma.LOG_DEBUG;
    
    return karma.set(obj);
};
