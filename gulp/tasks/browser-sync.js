var browserSync = require('browser-sync');
var gulp        = require('gulp');

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(['dist/**'], {
        proxy: "localhost:" + global.port
    });
});
