var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    merge = require('merge-stream'),
    DIST = 'dist';

gulp.task('clean', function () {
    return gulp.src(DIST, { read: false })
      .pipe(clean());
});

gulp.task('html', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest(DIST));
});

gulp.task('img', function () {
    return gulp.src('src/img/*')
        .pipe(gulp.dest(DIST));
});

gulp.task('less', function () {
    return gulp.src('src/css/site.less')
        .pipe(less())
        .pipe(minifycss({ keepSpecialComments: 0 }))
        .pipe(rename("dm.min.css"))
        .pipe(gulp.dest(DIST));
});

gulp.task('js', function () {

    var libs = gulp.src([
        'bower_components/fastclick/lib/fastclick.js',
        'bower_components/knockout/dist/knockout.js',
        'bower_components/knockout-postbox/build/knockout-postbox.min.js'])
      .pipe(concat('lib.js'))
      .pipe(uglify())
      .pipe(gulp.dest(DIST));

    var app = gulp.src([
            'src/js/ko-custom.js',
            'src/js/util.js',
            'src/js/decision.js',
            'src/js/report.js',
            'src/js/archive.js',
            'src/js/components.js',
            'src/js/app.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(DIST));

    return merge(libs, app);
});

gulp.task('gh-pages', function () {
    return gulp.src('CNAME')
        .pipe(gulp.dest(DIST));
});

gulp.task('default', ['clean'], function () {
    gulp.start('html', 'less', 'img', 'js', 'gh-pages');
});

gulp.task('watch', function () {
    gulp.watch(['gulpfile.js', 'src/**/*'], ['default']);
});