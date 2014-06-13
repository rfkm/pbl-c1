var gulp = require('gulp');

gulp.task('build', ['build-server', 'browserify', 'copy']);
