const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const pug         = require('gulp-pug');
const sass        = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf      = require('rimraf');
const rename      = require('gulp-rename');

// Static server
gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: "build"
    },
    port: 8080
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* compile */

gulp.task('views', function buildHTML() {
  return gulp.src('./src/views/index.pug')
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest('build'))
});

/* styles */

gulp.task('styles', function () {
  return gulp.src('./src/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});

/* sprites */

gulp.task('sprite', function(cb) {
  const spriteData = gulp.src('./src/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPatch: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('build/css/global/'));
  cb();
});

/* copy images */

gulp.task('copy:images', function() {
  return gulp.src('./src/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/* copy fonts */

gulp.task('copy:fonts', function() {
  return gulp.src('./src/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/* copy */

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* delete */

gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

/* watchers */

gulp.task('watch', function() {
  gulp.watch('./src/views/**/*.pug', gulp.series('views'));
  gulp.watch('./src/styles/**/*.scss', gulp.series('styles'));
});


gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('views', 'styles', 'sprite', 'copy'),
  gulp.parallel('watch', 'server')
));

