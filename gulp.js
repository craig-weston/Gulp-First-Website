const gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'), // JS minifyer
  sass = require('gulp-sass'), // Sass to css
  maps = require('gulp-sourcemaps'),
  csso = require('gulp-csso'),
  rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
  del = require('del'),
  browserSync = require('browser-sync').create();

const options = {
    src: 'src',
    dist: 'dist'
};

// concatenate, minify, and copy all of the project’s JavaScript files into all.min.js
gulp.task('scripts', function () {
    return gulp
      .src([
        `${options.src}/js/global.js`,
        `${options.src}/js/circle/autogrow.js`,
        `${options.src}/js/circle/circle.js`
      ])
      .pipe(concat('all.min.js'))
      .pipe(maps.init())
      .pipe(uglify())
      .pipe(maps.write('./'))
      .pipe(gulp.dest(`${options.dist}/scripts`));
});

// compile the project’s SCSS files into CSS, then concatenate and minify into an all.min.css file
// that is then copied to the dist/styles folder. Also creates sourcemaps
gulp.task('styles', function () {
    return gulp
      .src(`${options.src}/sass/global.scss`)
      .pipe(maps.init())
      .pipe(sass())
      .pipe(csso())
      .pipe(rename(`/all.min.css`))
      .pipe(maps.write('./'))
      .pipe(gulp.dest(`${options.dist}/styles`))
      .pipe(browserSync.stream());
});

// optimize the images
gulp.task('images', function () {
    return gulp
      .src(`${options.src}/images/*`)
      .pipe(imagemin([imagemin.jpegtran(), imagemin.optipng()]))
      .pipe(gulp.dest(`${options.dist}/content`));
});

// delete all of the files and folders in the dist folder.
gulp.task('clean', function () {
    del('dist/');
});

gulp.task('serve', ['styles'], function () {
    browserSync.init({
        server: './dist'
    });

    gulp.watch(`${options.src}/sass/**/*.scss`, ['styles']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('build', ['clean'], function () {
    gulp.start(['scripts', 'styles', 'images']);
    return gulp
      .src([`${options.src}/index.html`, `${options.src}/icons/**`], {
          base: `${options.src}/`
      })
      .pipe(gulp.dest(`${options.dist}`));
});

gulp.task('default', ['build'], function () {
    gulp.start('serve');
});