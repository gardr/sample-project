module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');

    // install client-dependencies with bower
    grunt.loadNpmTasks('grunt-bower-task');

    // bundle with browserify
    grunt.loadNpmTasks('grunt-browserify');

    // Load the plugin that provides the 'uglify' task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // testrunner
    grunt.loadNpmTasks('grunt-karma');

    // watcher
    grunt.loadNpmTasks('grunt-contrib-watch');

    //
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // maven deploy and release
    grunt.loadNpmTasks('grunt-maven-tasks');

    grunt.loadNpmTasks('grunt-template');


    var warFiles = [
        {
            expand: true,
            cwd: 'target/<%= pkg.name %>/',
            src: '**'
        }
    ];

    // Project configuration.
    grunt.initConfig({
        'clean': ['target', 'dist'],

        'pkg': grunt.file.readJSON('package.json'),

        'bower': {
            'install': {
                options: {
                    copy: false
                }
            }
        },

        'browserify': {
            'mobile': {
                src: ['src/mobile.js'],
                dest: 'target/<%= pkg.name %>/js/gardr/mobile.js'
            },
            'mobile-inframe': {
                src: ['src/mobile-inframe.js'],
                dest: 'target/<%= pkg.name %>/js/gardr/mobile-inframe.js'
            },
            'desktop': {
                src: ['src/desktop.js'],
                dest: 'target/<%= pkg.name %>/js/gardr/desktop.js'
            },
            'desktop-inframe': {
                src: ['src/desktop-inframe.js'],
                dest: 'target/<%= pkg.name %>/js/gardr/desktop-inframe.js'
            },
            'app-inframe': {
                src: ['src/app-inframe.js'],
                dest: 'target/<%= pkg.name %>/js/gardr/app-inframe.js'
            },
            options: {
                //transform: ['coffeeify']
                debug: false
            }
        },

        'uglify': {
            options: {
                report: 'gzip',
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today(\'yyyy-mm-dd\') %> */\n'
            },
            'mobile-inframe': {
                src: 'target/<%= pkg.name %>/js/gardr/mobile-inframe.js',
                dest: 'target/<%= pkg.name %>/js/gardr/mobile-inframe.min.js'
            },
            'app-inframe': {
                src: 'target/<%= pkg.name %>/js/gardr/app-inframe.js',
                dest: 'target/<%= pkg.name %>/js/gardr/app-inframe.min.js'
            },
            'mobile': {
                src: 'target/<%= pkg.name %>/js/gardr/mobile.js',
                dest: 'target/<%= pkg.name %>/js/gardr/mobile.min.js'
            },
            'desktop-inframe': {
                src: 'target/<%= pkg.name %>/js/gardr/desktop-inframe.js',
                dest: 'target/<%= pkg.name %>/js/gardr/desktop-inframe.min.js'
            },
            'desktop': {
                src: 'target/<%= pkg.name %>/js/gardr/desktop.js',
                dest: 'target/<%= pkg.name %>/js/gardr/desktop.min.js'
            }
        },


        'watch': {
            scripts: {
                files: ['src/**/*.js', 'test/unit/*.js'],
                tasks: ['jshint'],
                options: {
                    //nospawn: true,
                }
            }
            // ,
            // karma: {
            //     files: ['src/**/*.js', 'test/**/*.js'],
            //     tasks: ['karma:dev:run']
            // }
        },

        'jshint': {
            options: {
                tasks: ['browserify'],
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        },


        'karma': {
            options: {},
            watch: {
                configFile: 'test/karma.conf.js',
                singleRun: false
            },
            default: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },

        'template': {

            'process-mobile-template': {
                options: {
                    data: {
                        version: '<%= pkg.name %> v<%= pkg.version %>',
                        style: '',
                        id: 'GARDR',
                        initScript: 'banner.start();',
                        // relative to iframe url
                        scriptUrl: '../../js/gardr/mobile-inframe.min.js'
                    }
                },
                files: {
                    'target/<%= pkg.name %>/html/gardr/mobile.htm': ['src/templates/iframe-template.html']
                }
            },

            'process-desktop-template': {
                options: {
                    data: {
                        version: '<%= pkg.name %> v<%= pkg.version %>',
                        style: '',
                        id: 'GARDR',
                        initScript: 'banner.start();',
                        // relative to iframe url
                        scriptUrl: '../../js/gardr/desktop-inframe.min.js'
                    }
                },
                files: {
                    'target/<%= pkg.name %>/html/gardr/desktop.htm': ['src/templates/iframe-template.html']
                }
            },

            'process-samples-template': {
                options: {
                    data: {
                        version: '<%= pkg.name %> v<%= pkg.version %>',
                        style: '',
                        id: 'GARDR',
                        initScript: 'banner.start();',
                        scriptUrl: '/example_api.js'
                    }
                },
                files: {
                    'target/<%= pkg.name %>/html/gardr/example.htm': ['src/templates/iframe-template.html']
                }
            }
        },

        'maven': {
            options: {
                goal: 'deploy',
                groupId: 'no.finntech',
                type: 'war',
                file: 'target/gardr.war',
                injectDestFolder: false
            },
            deploy: {
                options: {
                    goal: 'deploy',
                    repositoryId: 'finntech-internal-snapshot',
                    url: 'http://mavenproxy.finntech.no/finntech-internal-snapshot/'
                },
                files: warFiles
            },
            release: {
                options: {
                    goal: 'release',
                    mode: 'patch',
                    repositoryId: 'finntech-internal-release',
                    url: 'http://mavenproxy.finntech.no/finntech-internal-release/'
                },
                files: warFiles
            },
        }

    });

    var baseTasks = [
        'jshint',
        'bower',
        'browserify:mobile',
        'browserify:mobile-inframe',
        'browserify:desktop',
        'browserify:desktop-inframe',
        'browserify:app-inframe',
        'uglify:mobile',
        'uglify:mobile-inframe',
        'uglify:desktop',
        'uglify:desktop-inframe',
        'uglify:app-inframe',
        'template:process-mobile-template',
        'template:process-desktop-template',
        'template:process-samples-template'
    ];

    // Default task(s).
    grunt.registerTask('test', [ 'karma:default' ]);
    grunt.registerTask('default', baseTasks.concat([
        'test'
    ]));

    grunt.registerTask('build', baseTasks.slice(1));

    grunt.registerTask('ci', baseTasks.concat([
        'karma:ci'
    ]));

    grunt.registerTask('deploy', [ 'clean', 'default', 'maven:deploy' ]);
    grunt.registerTask('release', function () {
        var args = Array.prototype.slice.call(arguments);
        grunt.task.run([ 'clean', 'default', ['maven:release'].concat(args).join(':') ]);
    });

};
