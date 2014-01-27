module.exports = function (karma) {
    karma.set({
        basePath: "",
        frameworks: ["mocha", "chai"],
        files: [
            "browserified/host.js",
            {
                pattern: "browserified/*.js",
                included: false,
                served: true,
                watched: true
            },
            "test/lib/Function-polyfill.js",
            "test/**/*.test.js",
            {
                pattern: "test/fixtures/*",
                included: false,
                served: true,
                watched: true
            }
        ],
        exclude: [],
        reporters: ["progress"],
        colors: true,
        logLevel: karma.LOG_WARN,
        autoWatch: true,
        browsers: ["PhantomJS"],
        captureTimeout: 10000,
        singleRun: false,
        plugins: ["karma-*"]
    });
};
