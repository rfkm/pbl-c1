var gulp = require('gulp');

gulp.task('set-watch', function() {
    global.isWatching = true;
    global.port = process.env.PORT || 5000; // TODO: move to other task
});
