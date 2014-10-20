// Include gulp
var gulp = require('gulp');

// Include Gulp Plugins

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

gulp.task('lint', function() {
   return gulp.src('source/*.js')
       .pipe(jshint())
       .pipe(jshint.reporter('default'));
});

gulp.task('dist', function() {
   return gulp.src('source/*.js')
       .pipe(concat('ks-scroll-repeat.js'))
       .pipe(gulp.dest('dist'))
       .pipe(uglify())
       .pipe(rename('ks-scroll-repeat.min.js'))
       .pipe(gulp.dest('dist'));
});

gulp.task('test', function() {

});

gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'dist']);
});

gulp.task('default', ['lint', 'dist', 'watch']);
