// Include gulp
const gulp = require('gulp');
const connect = require('gulp-connect');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const cleanCss = require('gulp-clean-css');
// const usemin = require('gulp-usemin');
const critical = require('critical'); // new
// const rename = require('gulp-rename'); // new
const ngAnnotate = require('gulp-ng-annotate'); // new
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

/*
const paths = {
  styles: {
    src: ['src/css/*.css'],
    watch: ['src/css/*.css'],
    tmp:  'tmp/',
    dest: 'src/css/'
  },
  js: {
    src: ['src/js/*.js'],
    watch: ['src/js/*.js'],
    tmp:  'tmp/',
    dest: 'app/js/'
  }
}*/

gulp.task('minify-html', () => {
  return gulp.src('docs/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('docs'));
});

gulp.task('copy-html-files', function () {
  return gulp.src(['./src/**/*.html'], {base: './src'})
    .pipe(gulp.dest('docs/'));
});

gulp.task('copy-font-files', function () {
  return gulp.src(['./src/fonts/**/*.*'])
    .pipe(gulp.dest('docs/fonts/'));
});

gulp.task('copy-images', function () {
  return gulp.src(['./src/img/**/*.*'])
    .pipe(gulp.dest('docs/img/'));
});

gulp.task('copy-cname', function () {
  return gulp.src(['./src/CNAME'])
    .pipe(gulp.dest('docs/'));
});

gulp.task('copy-css-files', function () {
  return gulp.src(['./src/css/*.*'])
    .pipe(gulp.dest('docs/css/'));
});

gulp.task('usemin', function () {
  return gulp.src('./src/index.html')
    .pipe(usemin({
      css: [cleanCss(), 'concat'],
      js: [ngAnnotate(), uglify()]
    }))
    .pipe(gulp.dest('docs/'));
});

gulp.task('styles', () => {
  return gulp.src(paths.styles.src)
    .pipe(gulp.dest(paths.styles.tmp))
    .pipe(sourcemaps.init())
    .pipe(concat('site.css'))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('clean', del.bind(null, ['tmp/', 'docs/']));
gulp.task('build', gulp.series(['clean', 'copy-css-files','copy-html-files', 'minify-html', 'copy-font-files', 'copy-images', 'copy-cname' ]));
gulp.task('connect', function () { connect.server({ root: 'src/' }); });


gulp.task('criticalcss', function (cb) {
    return critical.generate({
      base: './docs/',
      src: 'index.html',
      //styleTarget: './docs/css/site.css',
      width: 960,
      height: 600,
      minify: true,
      inline: true,
      dest: 'index.html',
      extract: true
    }, cb.bind(cb));
});

gulp.task('critical', gulp.series(['clean', 'build', 'criticalcss']));


// Default Task
gulp.task('default', gulp.series(['critical']));


// end critical-path css