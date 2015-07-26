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
    
    grunt.registerTask('default', ['connect', 'watch']);
};
