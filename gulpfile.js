// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  htmlclean = require('gulp-htmlclean'),
  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),
  browserSync = require('browser-sync'),
  nodemon = require('gulp-nodemon'),

  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // folders
  folder = {
    src: 'src/',
    build: 'build/'
  }
;

/**
 * Gulp Tasks
 */

var reload = browserSync.reload;

gulp.task('clean', function (done) {
  require('del')(['dist'], done);
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    //proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true,
    server: "public",
    open: true
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  nodemon({
    script: 'index.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      browserSync.reload();
    }, 1000);
  });
});

gulp.task('serve', ['browser-sync'], function () {
  gulp.watch(['public/*.html'], browserSync.reload);
});
