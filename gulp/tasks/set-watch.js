var gulp = require('gulp');

gulp.task('set-watch', function() {
    global.isWatching = true;
    global.port = 5000; // TODO: move to other task
});
