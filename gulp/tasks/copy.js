var gulp = require('gulp');
var merge = require('merge-stream');

gulp.task('copy', function() {
    var p = gulp.src('src/public/**')
	    .pipe(gulp.dest('dist/public'));
    var v = gulp.src('src/views/**')
	    .pipe(gulp.dest('dist/views'));
    var s = gulp.src('src/*.coffee')
	    .pipe(gulp.dest('dist'));
    return merge(p, v, s);
});
