var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('server', function () {
    connect.server({
        root: '.',
        hostname: '0.0.0.0',
        port: 3030
    });
});

gulp.task('default', ['server']);