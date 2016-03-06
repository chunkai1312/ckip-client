'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('mocha', function () {
  return gulp.src('test/**/*.js')
    .pipe(mocha({ reporter: 'nyan' }))
    .once('error', function () {
      process.exit(1);
    })
    .once('end', function () {
      process.exit();
    });
});

gulp.task('default', ['mocha']);