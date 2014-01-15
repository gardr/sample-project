module.exports = function (karma) {
    return {
        basePath: '../',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            'test/lib/Function-polyfill.js',
            'test/ig/*.test.js',
            'test/unit/**/*.test.js',
            {
                pattern: 'src/*.js',
                included: false,
                served: true,
                watched: true
            },
            {
                pattern: 'test/fixtures/*',
                included: false,
                served: true,
                watched: true
            },
            {
                pattern: 'src/lib/**/*.js',
                included: true,
                served: true,
                watched: true
            }
        ],
        exclude: [],
        reporters: ['progress'],
        port: 9876,
        runnerPort: 9100,
        captureTimeout: 60000,
        colors: true,

        logLevel: karma.LOG_WARN,

        autoWatch: true,

        browsers: ['PhantomJS'],

        singleRun: false,

        preprocessors: {
            'test/ig/**/*.js': 'bundle',
            'test/unit/**/*.js': 'bundle',
            'src/*.js': 'bundle',
            'src/lib/**/*.js': ['bundle', 'coverage']
        },

        plugins: ['karma-*', require('./bundle.js')]
    };
};
