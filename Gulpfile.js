var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var cleancss = require('gulp-cleancss');
var webserver = require('gulp-webserver');

gulp.task('default', ['webserver', 'watch']);

gulp.task('watch', function () {
  gulp.watch('css/**/*.scss', ['build-css'])
});

gulp.task('build-css', () => {
  const sassFiles = [
    'css/style.scss'
  ];
  const sassOptions = {
    outputStyle: 'compressed'
  };
  const cleancssOptions = {
    keepBreaks: false
  };

  return gulp.src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(cleancss(cleancssOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css'));
});


gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true,
      fallback: 'index.html'
    }));
});
