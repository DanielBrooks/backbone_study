"use strict";

(function(r) {
  var gulp = r('gulp'),
      sass = r('gulp-sass'),
      cssbeautify = r('gulp-cssbeautify'),
      haml = r('gulp-haml'),
      prettify = r('gulp-prettify');

  gulp.task('sass-compressed', function() {
    gulp.src(
      'scss/*.scss'
    )
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('css'));
  });

  gulp.task('sass', function() {
    gulp.src(
      'scss/*.scss'
    )
    .pipe(sass())
    .pipe(cssbeautify({
      indent: '  '
    }))
    .pipe(gulp.dest('build/css'));
  });

  gulp.task('haml', function() {
    gulp.src(
      'haml/*.haml'
    )
    .pipe(haml())
    .pipe(prettify({
      'indent_size': 2
    }))
    .pipe(gulp.dest('build/html'));
  });

  gulp.task('watch', function() {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('haml/*.haml', ['haml']);
  });

  gulp.task('default', ['haml', 'sass', 'watch']);

})(require);