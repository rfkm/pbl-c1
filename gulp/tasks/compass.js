var compass      = require('gulp-compass');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');

var apps = ["editor", "kintone-lib"];

var createTask = function(src, dest){
    return function() {
        return gulp.src(src + "/*.scss")
            .pipe(compass({
                config_file: 'compass.rb',
                css: dest,
                sass: src
            }))
            .on('error', handleErrors)
        ;
    };
};

// Generate sub tasks
apps.forEach(function(m){
    gulp.task("compass:" + m, 
              createTask("./src/apps/" + m + "/styles", 
                         "web/build/" + m));
});

// Generate main task
var tasks = apps.map(function(app){ return "compass:" + app; });
gulp.task('compass', tasks);
