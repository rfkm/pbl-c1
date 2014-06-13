var browserify   = require('browserify');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
// var notify       = require('gulp-notify');

var apps         = ["index"];

var createTask = function(entries){
    return function() {
        var bundleMethod = global.isWatching ? watchify : browserify;

        var bundler = bundleMethod({
            entries: entries,
            extensions: ['.coffee']
        });

        var bundle = function() {
            bundleLogger.start();

            return bundler
                .bundle({debug: true}) // Enable source maps
                .on('error', handleErrors)
                .pipe(source("build.js"))
                .pipe(gulp.dest('./dist/public/js/'))
                // .pipe(notify("Run browserify"))
                .on('end', bundleLogger.end);
        };

        if(global.isWatching) {
            // Rebundle with watchify on changes.
            bundler.on('update', bundle);
        }

        return bundle();
    };
};

// Generate sub tasks
apps.forEach(function(m){
    gulp.task("browserify:" + m, 
              createTask(["./src/client/index.coffee"]));
});

// Generate main task
var tasks = apps.map(function(app){ return "browserify:" + app; });
gulp.task('browserify', tasks);
