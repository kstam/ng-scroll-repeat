// Include gulp
var gulp = require('gulp');

// Include Gulp Plugins

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var header = require('gulp-header');
var karma = require('karma').server;
var fs = require('fs');

var getCopyright = function() {
   return fs.readFileSync('source/Copyright');
};

var getVersion = function() {
    var bowerFile = fs.readFileSync('bower.json');
    return JSON.parse(bowerFile).version;
};

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
       .pipe(header(getCopyright(), {version: getVersion()}))
       .pipe(gulp.dest('dist'))
       .pipe(uglify())
       .pipe(header(getCopyright(), {version: getVersion()}))
       .pipe(rename('ng-scroll-repeat.min.js'))
       .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('source/*.js', ['lint', 'test']);
});

gulp.task('default', ['lint', 'bower', 'test', 'dist', 'testDist', 'testDistMin']);
