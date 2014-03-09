/* global module:false */
module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        cssmin: {
            compress: {
                options: {
                    keepSpecialComments: 0
                },
                files: {
                    'public/build/default.min.css': [
                        'public/components/bootstrap/dist/css/bootstrap.min.css',
                        'public/components/font-awesome/css/font-awesome.min.css',
                        'public/components/greppy/dist/css/greppy.min.css',
                        'public/css/app.css'
                    ],

                    'public/build/blog.min.css': [
                        'public/css/fixed-nav.css',
                        'public/modules/blog/css/app.css'
                    ],

                    'public/build/docs.min.css': [
                        'public/css/fixed-nav.css',
                        'public/modules/docs/css/app.css'
                    ],

                    'public/build/home.min.css': [
                        'public/css/marketing.css',
                        'public/modules/home/css/app.css'
                    ]
                }
            }
        },

        uglify: {
            compress: {
                files: {
                    'public/build/default.min.js': [
                        'public/components/jquery/dist/jquery.min.js',
                        'public/components/greppy/dist/js/greppy.min.js',
                        'public/components/bootstrap/dist/js/bootstrap.min.js',
                        'public/components/spin.js/spin.js',
                        'public/js/app.js',
                        'public/js/google-analytics.js'
                    ],

                    'public/build/blog.min.js': [
                        'public/modules/blog/js/app.js'
                    ],

                    'public/build/docs.min.js': [
                        'public/modules/docs/js/app.js'
                    ],

                    'public/build/home.min.js': [
                        'public/modules/home/js/app.js'
                    ]
                }
            }
        },

        watch: {
            main: {
                options: {
                    // Start a live reload server on the default port 35729
                    livereload: true
                },
                files: [
                    'Gruntfile.js',
                    'public/css/*',
                    'public/modules/**/css/*',
                    'public/js/*',
                    'public/modules/**/js/*'
                ],
                tasks: 'default'
            },
            views: {
                options: {
                    // Start a live reload server on the default port 35729
                    livereload: true
                },
                files: [
                    'Gruntfile.js',
                    'modules/**/*.jade'
                ],
            }
        }
    });

    // Dependencies
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task
    grunt.registerTask('default', ['cssmin', 'uglify']);

    // Content generation (jade to HTML)
    grunt.registerTask('templates', ['shell']);

    // Serve presentation locally
    grunt.registerTask('serve', ['connect', 'watch']);
};

