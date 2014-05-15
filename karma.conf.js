module.exports = function (karma) {
    karma.set({
        basePath: "",
        frameworks: ["mocha", "chai"],
        files: [
            "test/lib/Function-polyfill.js",
            "gardr/host.js",
            {
                pattern: "gardr/*",
                included: false,
                served: true,
                watched: true
            },
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
