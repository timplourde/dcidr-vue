var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    TARGET = 'dev-build',
    runSequence = require('run-sequence'),
    webpack = require('webpack'),
    webPackConfig = require('./webpack.config');

if(process.env.NODE_ENV === 'production'){
    TARGET = 'docs'; // for gh-pages
}

gulp.task('clean', function () {
    return gulp.src(TARGET, { read: false })
      .pipe(clean());
});

gulp.task('html', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest(TARGET));
});

gulp.task('img', function () {
    return gulp.src('src/img/*')
        .pipe(gulp.dest(TARGET));
});

gulp.task('less', function () {
    return gulp.src('src/css/site.less')
        .pipe(less())
        .pipe(minifycss({ keepSpecialComments: 0 }))
        .pipe(rename("dm.min.css"))
        .pipe(gulp.dest(TARGET));
});

gulp.task('js', function (done) {
    var webPackCompiler = webpack(webPackConfig);
   webPackCompiler.run(function (err, stats) {
        if (err) {
            gutil.log('Error', err);
            if (done) {
                done();
            }
        } else {
            Object.keys(stats.compilation.assets).forEach(function(key) {
                gutil.log('Webpack: output ', gutil.colors.green(key));
            });
            if (done) {
                done();
            }
        }
    });
    
});

gulp.task('gh-pages', function () {
    return gulp.src('CNAME')
        .pipe(gulp.dest(TARGET));
});

gulp.task('all', function () {
    gulp.start('html', 'less', 'img', 'js');
});

gulp.task('watch', function () {
    gulp.watch(['gulpfile.js', 'src/**/*'], ['all']);
});

gulp.task('build', function () {
    runSequence('clean', 'all', 'gh-pages');
});

gulp.task('default', function () {
    gulp.start('watch');
});