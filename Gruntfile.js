/**
 * Grunt configuration for front end deployment.
 *
 * The following tasks will generate development or production front end
 * ready code. This includes linting, compiling and minifying code. As a
 * standard `development` tasks will lint and compile (no minification) while
 * `production` tasks should compile and minify (no linting).
 *
 * @author jimmyhillis <jimmy@hatchd.com.au>
 * @author neilf <neil@hatchd.com.au>
 */

module.exports = function (grunt) {
    'use strict';

    // Task configuration
    //
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            stylesheets: 'static/stylesheets',
            scripts: 'static/scripts',
            fonts: 'static/fonts',
            eggboxicons: 'static/libs/eggbox/',
            custom_eggboxicons: 'static/custom-eggbox'
        },
        regarde: {
            js: {
                files: [
                    '<%= dirs.scripts %>/**/*.js',
                    '!<%= dirs.scripts %>/**/*min.js'
                ],
                tasks: ['jshint', 'requirejs'],
                spawn: true
            },
            css: {
                files: '<%= dirs.stylesheets %>/**/*.scss',
                tasks: ['sass:development', 'autoprefixer:development'],
                spawn: true
            },
            eggbox: {
                files: '<%= dirs.custom_eggboxicons %>/**/*.svg',
                tasks: ['webfont'],
                spawn: true
            }
        },
        clean: [
            '<%= dirs.scripts %>/*.min.js',
            '<%= dirs.stylesheets %>/*.css'
        ],
        // Webfonts
        webfont: {
            production: {
                src: [
                    '<%= dirs.eggboxicons %>/src/*.svg',
                    '<%= dirs.custom_eggboxicons %>/*.svg'],
                dest: '<%= dirs.fonts %>/eggbox',
                htmlDemo : true,
                destCss: '<%= dirs.stylesheets %>/sass/reusable-components/',
                options: {
                    hashes: false,
                    font: 'eggbox',
                    icon: 'eggbox',
                    relativeFontPath: '../fonts/eggbox',
                    template: '<%= dirs.eggboxicons %>/templates/eggbox.css',
                    htmlDemoTemplate: '<%= dirs.eggboxicons %>/templates/your-eggbox.html',
                    destHtml: '<%= dirs.fonts %>/eggbox',
                    stylesheet: 'scss'
                }
            }
        },
        // Stylesheets
        sass: {
            development: {
                options: {
                    style: 'expanded',
                    sourcemap: true,
                    debugInfo: true,
                    lineNumbers: true,
                    noCache: true
                },
                files: {
                    '<%= dirs.stylesheets %>/styles.css': '<%= dirs.stylesheets %>/sass/styles.scss'
                }
            },
            production: {
                options: {
                    style: 'compressed',
                    noCache: true
                },
                files: {
                    '<%= dirs.stylesheets %>/styles.css': '<%= dirs.stylesheets %>/less/styles.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 3 versions', '> 1%', 'ie 8', 'ie 7']
            },
            development: {
                files: {
                    '<%= dirs.stylesheets %>/styles.css': '<%= dirs.stylesheets %>/styles.css'
                }
            },
            production: {
                files: {
                    '<%= dirs.stylesheets %>/styles.css': '<%= dirs.stylesheets %>/styles.css'
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    '<%= dirs.stylesheets %>/styles.css': '<%= dirs.stylesheets %>/styles.css'
                }
            }
        },
        // Javascript
        jshint: {
            all: [
                'Gruntfile.js',
                '<%= dirs.scripts %>/{,*/}*.js',
                '!<%= dirs.scripts %>/{,*/}*.min.js'
            ]
        },
        requirejs: {
            compile: {
                options: {
                    name: 'app',
                    baseUrl: '<%= dirs.scripts %>',
                    mainConfigFile: '<%= dirs.scripts %>/app.js',
                    out: '<%= dirs.scripts %>/app.min.js'
                }
            }
        },
        modernizr: {
            devFile: 'remote',
            outputFile: '<%= dirs.scripts %>/../libs/modernizr/modernizr.min.js',
            extra: {
                'shiv': true,
                'load': false,
                'cssclasses': true
            },
            uglify: true,
            parseFiles: true,
            files: [
                '<%= dirs.stylesheets %>/styles.css',
                '<%= dirs.scripts %>/app.min.js'
            ]
        }
    });

    // Required tasks

    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-modernizr');

    // Simply watch script which does a build on entry
    grunt.registerTask('watch', [
        'default',
        'regarde'
    ]);

    // Build for development purposes with linting
    grunt.registerTask('default', [
        'clean',
        'webfont',
        'sass:development',
        'autoprefixer:development',
        'jshint',
        'requirejs',
        'modernizr'
    ]);

    // Server build
    grunt.registerTask('server', [
        'clean',
        'webfont',
        'sass:production',
        'autoprefixer:production',
        'cssmin',
        'requirejs'
    ]);

};
