var gulp = require('gulp');

gulp.task('watch', ['set-watch', 'browser-sync'], function() {
    // gulp.watch('src/sass/**', ['compass']);
    // gulp.watch('src/images/**', ['images']);
    // gulp.watch('src/htdocs/**', ['copy']);
    // gulp.watch('src/*.coffee', ['build-server']);
    gulp.watch(['src/public/**',
                'src/views/**',
                'src/*.coffee'], ['copy']);
});
