var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpIf = require('gulp-if');
var twig = require('gulp-twig');
var useref = require('gulp-useref');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var browserSync = require('browser-sync').create();

const paths = {
  sass: {
    files: ['**/*.sass', '!./variables/*.sass', '!**/_*.sass'],
  },
  js: {
    files: ['components/**/*.js', '!**/_*.js']
  }
};

gulp.task('sass', function(){
  return gulp.src(paths.sass.files)
    .pipe(sass({
      includePaths: './variables/',
      outputStyle: 'compressed'
    }))
    .pipe(cssnano())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', function() {
  return gulp.src(paths.js.files)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'))
});

gulp.task('useref', function(){
  return gulp.src('*/_html.twig')
    .pipe(useref())
    .pipe(gulpIf('js/*.js', uglify()))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './web',
    },
    serveStatic: ['.', './css/']
  })
});

gulp.task('compile', function () {
  return gulp.src('./dummy/*.twig')
    .pipe(twig({
      data: {
        title: 'Gloom-wine',
      }
    }))
    .pipe(gulp.dest('./web'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('watch', ['browserSync', 'sass', 'js', 'compile'], function (){
  gulp.watch('*/*.twig', ['compile']);
  gulp.watch('*/js/*.js', browserSync.reload);
  gulp.watch('**/*.sass', ['sass']);
});