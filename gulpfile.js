// Include gulp
var gulp = require('gulp');

// Include Gulp Plugins

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var karma = require('karma').server;

gulp.task('lint', function() {
   return gulp.src('source/*.js')
       .pipe(jshint())
       .pipe(jshint.reporter('default'));
});

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('libs/'));
});

gulp.task('test', function(done) {
    // Be sure to return the stream
    karma.start({
        configFile: __dirname + '/test/config/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('testDist', function(done) {
    // Be sure to return the stream
    karma.start({
        configFile: __dirname + '/test/config/karma.conf.dist.js',
        singleRun: true
    }, done);
});

gulp.task('testDistMin', function(done) {
    // Be sure to return the stream
    karma.start({
        configFile: __dirname + '/test/config/karma.conf.distMin.js',
        singleRun: true
    }, done);
});

gulp.task('dist', function() {
   return gulp.src('source/*.js')
       .pipe(concat('ng-scroll-repeat.js'))
       .pipe(gulp.dest('dist'))
       .pipe(uglify())
       .pipe(rename('ng-scroll-repeat.min.js'))
       .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('source/*.js', ['lint', 'test']);
});

gulp.task('default', ['lint', 'bower', 'test', 'dist', 'testDist', 'testDistMin']);
