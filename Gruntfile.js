module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 9001,
                    base: '.'
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: false
            }
        },

        watch: {
            grunt: { files: ['Gruntfile.js'] },

            livereload: {
                options: { livereload: true },
                files: ['app/*', '**/*.html']
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['connect', 'watch']);
    
    grunt.registerTask('test', ['karma']);
    
    
    
    
    
    
    
};
