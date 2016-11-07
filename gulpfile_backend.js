var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    nodemon = require('gulp-nodemon'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    webpackConfig = require("./webpack.config.js"),
    webpackPrdConfig = require("./webpack.prd.config.js"),
    path = require('path');

var distBase = 'dist';a

var errorHandle = function (error) {
    if (!error) {
        gutil.log(gutil.colors.red('compile error: ' + error.messate));
        //this.emit(); //submit
    }
};

gulp.task('server', function () {
    return nodemon({
        script: 'dist/server.js',
        watch: 'dist/server.js'
        //...add nodeArgs: ['--debug=5858'] to debug
        //..or nodeArgs: ['--debug-brk=5858'] to debug at server start
    })
});

gulp.task('dist:clean', function () {
    return gulp.src('dist/*')
        .pipe(clean());
});
gulp.task('webpack', function () {
    var myConfig = Object.create(webpackConfig);

    return webpack(myConfig, function (err, stats) {
        if (err) {
            errorHandle(err);
        }
    });
});
gulp.task('webpack:prd', function () {
    var myConfig = Object.create(webpackPrdConfig);

    return webpack(myConfig, function (err, stats) {
        if (err) {
            errorHandle(err);
        }
    });
});

gulp.task('build', ['dist:clean'], function () {
    return runSequence('webpack:prd');
});

gulp.task('dev', ['dist:clean'], function () {
    gulp.start('webpack');
    setTimeout(function() {
        gulp.start('server');
    }, 3000);
});
