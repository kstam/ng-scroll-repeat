//Karma configuration for version 0.10

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '../../',

        //Frameworks using
        frameworks: ['jasmine'],

        plugins: ['karma-jasmine',
            'karma-junit-reporter',
            'karma-script-launcher',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher'],

        // list of files / patterns to load in the browser
        files: [
            //Define here all the dependencies that are not RequireJS friendly
            //'main/webapp/js/libs/jquery/jquery-1.9.1.js',
            'libs/jquery/dist/jquery.js',
            'libs/angular/angular.js',

            'libs/angular-mocks/angular-mocks.js',

            'dist/scroll-repeat.js',
            'test/**/*.js'
        ],

        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        reporters: ['progress'],

        // web server port
        port: 8082,

        // cli runner port
        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 10000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false

    });
};
