var gulp = require('gulp')
var nodemon = require('gulp-nodemon');

gulp.task('nodemon', ['build'], function (cb) {
    var called = false
    return nodemon({ script: './dist/server.coffee', env: {"PORT": global.port || 3000}})
        .on('start', function(){
            if (!called) {
                called = true
                cb()
            }
        })
        // .on('change', ['build'])
        .on('restart', function () {
            console.log('restarted!')
        })
})
