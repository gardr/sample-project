module.exports = function (karma) {
    return {
        basePath: "",
        frameworks: ["jasmine", "browserify"],
        files: [
            "test/**/*.test.js",
            {
                pattern: "test/fixtures/*",
                included: false,
                served: true,
                watched: true
            },
            {
                pattern: "src/**/*.js",
                included: false,
                served: true,
                watched: true
            }
        ],
        exclude: [],
        reporters: ["progress"],
        port: 9876,

        runnerPort: 9100,

        colors: true,

        logLevel: karma.LOG_WARN,

        autoWatch: true,

        browsers: ["PhantomJS"],

        captureTimeout: 60000,
        singleRun: false,
        browserify: {
            watch: true
        },
        preprocessors: {
            "test/unit/**/*.js": "browserify",
            "test/ig/**/*.js": "browserify",
            "src/**/*.js": "browserify_plain"
        },
        plugins: ["karma-*", require("./browserify_plain.js")]
    };
};
