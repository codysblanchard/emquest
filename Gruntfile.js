module.exports = function (grunt) {
    grunt.initConfig({
        execute: {
            target: {
                src: ['emojiquest.js']
            }
        },
        watch: {
            scripts: {
                files: ['emojiquest.js'],
                tasks: ['execute'],
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-execute');
};