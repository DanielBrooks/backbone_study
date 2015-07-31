"use strict";

(function(r) {
  var gulp = r('gulp'),
      sass = r('gulp-sass'),
      cssbeautify = r('gulp-cssbeautify');

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

  gulp.task('watch', function() {
    gulp.watch('scss/*.scss', ['sass']);
  });

  gulp.task('default', ['sass', 'watch']);

})(require);