module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [
            {
              name: "small",
              width: 480
            },
            {
              name: "large",
              width: 1024
            }
          ]
        },
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img/',
          dest: 'images/'
        }]
      }
    },
 /* Clear out the images directory if it exists */
 clean: {
  dev: {
    src: ['images'],
  }
},
/* Generate the images directory if it is missing */
mkdir: {
  dev: {
    options: {
      create: ['images']
    },
  },
},
  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['mkdir','responsive_images']);

};