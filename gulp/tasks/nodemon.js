var gulp = require('gulp')
var nodemon = require('gulp-nodemon');


gulp.task('nodemon', ['build'], function () {
    nodemon({ script: './dist/server.js', ext: 'html js', ignore: ['ignored.js'], env: {"PORT": global.port} })
        // .on('change', ['lint'])
        .on('restart', function () {
            console.log('restarted!')
        })
})
