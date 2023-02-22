'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    version: grunt.file.readJSON('package.json').version,

    buildDir: 'dist',

    banner: [
      '/*!',
      ' * autocomplete.js <%= version %>',
      ' * https://github.com/algolia/autocomplete.js',
      ' * Copyright <%= grunt.template.today("yyyy") %> Algolia, Inc. and other contributors; Licensed MIT',
      ' */'
    ].join('\n'),

    usebanner: {
      all: {
        options: {
          position: 'top',
          banner: '<%= banner %>',
          linebreak: true
        },
        files: {
          src: ['dist/*.js']
        }
      }
    },

    uglify: {
      jquery: {
        src: '<%= buildDir %>/autocomplete.jquery.js',
        dest: '<%= buildDir %>/autocomplete.jquery.min.js'
      },
      angular: {
        src: '<%= buildDir %>/autocomplete.angular.js',
        dest: '<%= buildDir %>/autocomplete.angular.min.js'
      },
      standalone: {
        src: '<%= buildDir %>/autocomplete.js',
        dest: '<%= buildDir %>/autocomplete.min.js'
      }
    },

    webpack: {
      jquery: {
        entry: './index_jquery.js',
        output: {
          path: '<%= buildDir %>',
          filename: 'autocomplete.jquery.js'
        },
        externals: [{
          jquery: 'jQuery'
        }]
      },
      angular: {
        entry: './index_angular.js',
        output: {
          path: '<%= buildDir %>',
          filename: 'autocomplete.angular.js'
        },
        externals: ['angular']
      },
      standalone: {
        entry: './index.js',
        output: {
          path: '<%= buildDir %>',
          filename: 'autocomplete.js',
          library: 'autocomplete',
          libraryTarget: 'umd'
        }
      }
    },

    sed: {
      version: {
        pattern: '%VERSION%',
        replacement: '<%= version %>',
        recursive: true,
        path: '<%= buildDir %>'
      }
    },

    eslint: {
      options: {
        config: '.eslintrc'
      },
      src: ['src/**/*.js', 'Gruntfile.js']
    },

    watch: {
      js: {
        files: 'src/**/*.js',
        tasks: 'build'
      }
    },

    clean: {
      dist: 'dist'
    },

    connect: {
      server: {
        options: {port: 8888, keepalive: true}
      }
    },

    concurrent: {
      options: {logConcurrentOutput: true},
      dev: ['server', 'watch']
    },

    step: {
      options: {
        option: false
      }
    }
  });

  // aliases
  // -------

  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['webpack', 'sed:version', 'uglify', 'usebanner']);
  grunt.registerTask('server', 'connect:server');
  grunt.registerTask('lint', 'eslint');
  grunt.registerTask('dev', 'concurrent:dev');

  // load tasks
  // ----------

  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-step');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-webpack');
};
