/* global module, require */

module.exports = function(grunt) { 'use strict';
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.config.init({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            default: {
                src: ['build', '.tmp', '.sass-cache', 'tests/coverage']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            test: {
                src: 'tests/specs/**/*.js'
            },
            frontend: {
                src: 'src/front-end/**/*.js'
            },
            backend: {
                src: 'src/back-end/**/*.js'
            }
        },
        ngAnnotate: {
            default: {
                src: '.tmp/concat/js/app.min.js'
            }
        },
        useminPrepare: {
            html: 'src/front-end/index.html',
            options: {
                dest: 'build/front-end'
            }
        },
        /* Add vendors prefixes */
        autoprefixer: {
            options: {
                browsers: 'last 2 versions'
            },
            default: {
                src: '<%= sass.default.dest %>',
                dest: 'src/front-end/styles/styles.css'
            }
        },
        /*
            First copy files to tmp dirrectory, then autoprefixer copies them to the src folder, so that
            that on styles.css watch will be triggered only once.
        */
        sass: {
            default: {
                options: {
                    sourcemap: 'none'
                },
                src: 'src/front-end/styles/scss/main.scss',
                dest: '.tmp/sass/styles.css'
            }
        },
        copy: {
            default: {
                files: [
                    {'build/front-end/index.html': 'src/front-end/index.html'},
                    {'build/back-end/app.js': 'src/back-end/app.js'}
                ]
            }
        },
        usemin: {
            html: 'build/front-end/index.html'
        },
        filerev: {
            default: {
                src: [
                    'build/front-end/styles/styles.css',
                    'build/front-end/js/app.min.js',
                    'build/front-end/js/libs.js'
                ]
            }
        },
        htmlmin: {
            options: {
                collapseWhitespace: true,
                removeComments: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true,
                removeOptionalTags: true,
                minifyJS: true,
                processScripts: ['text/ng-template'],
                removeAttributeQuotes: true
            },
            default: {
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: '**/*.html',
                    dest: 'build/'
                }]
            }
        },
        watch: {
            scss: {
                options: {
                    atBegin: true
                },
                files: ['src/front-end/styles/**/*.scss'],
                tasks: ['sass', 'autoprefixer']
            },
            livereload: {
                files: [
                    'src/front-end/**/*',
                    '!src/front-end/styles/**/*.scss',
                    '!src/front-end/images/sprites/*',
                    '!src/back-end/**/*'
                ],
                options: {
                    livereload: true
                }
            }
        },
        karma: {
            default: {
                configFile: 'tests/karma.conf.js'
            }
        },
        nodemon: {
            default: {
                options: {
                    watch: ['src/back-end/app.js']
                },
                script: 'src/back-end/app.js'
            }
        },
        concurrent: {
            default: {
                tasks: ['watch', 'nodemon'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('build', [
        'clean:default',
        'jshint',
        'useminPrepare:html',
        'concat:generated',
        'ngAnnotate:default',
        'uglify:generated',
        'sass:default',
        'autoprefixer:default',
        'cssmin:generated',
        'copy:default',
        'filerev:default',
        'usemin:html',
        'htmlmin:default'
    ]);

    grunt.registerTask('developing', [
        'concurrent:default'
    ]);

    grunt.registerTask('test', [
        'karma:default'
    ]);
};