var browserSync = require('browser-sync');
var gulp        = require('gulp');

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init("dist/**", {
        // proxy: "localhost:" + global.port,
        server: {
            baseDir: "./dist/public"
        },
        open: true,
        ports: {
            min: 3100
        }
    });
});
