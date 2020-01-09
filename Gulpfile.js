var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create();

// SETTINGS
var cfg = {
  scripts: {
    src: './assets/js/**/*',
    dist: './build/assets/js/',
    filename: 'bundle.js',
    entrypoint: './assets/js/main.js'
  },
  styles: {
    src: './assets/scss/**/*',
    dist: './build/assets/css/'
  }
};

// SCRIPTS
gulp.task('scripts', function () {
  return browserify({entries: cfg.scripts.entrypoint, debug: true})
    .transform("babelify", { presets: ["env"] })
    .bundle()
    .pipe(source(cfg.scripts.filename))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(cfg.scripts.dist))
    .pipe(browserSync.stream());
});

// STYLES
gulp.task('styles', function () {
  gulp.src(cfg.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', function(err) {
      console.error(err.message);
      browserSync.notify(err.message, 3000);
      this.emit('end');
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cfg.styles.dist))
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(cfg.styles.dist))
    .pipe(browserSync.stream());
});

// WATCH
gulp.task('watch', [
  'styles',
  'scripts',
], function () {
  browserSync.init({
    server: "./build"
  });

  gulp.watch(cfg.styles.src, ['styles']);
  gulp.watch(cfg.scripts.src, ['scripts']);

  // Kill watch if GulpFile edited
  gulp.watch("Gulpfile.js").on("change", () => process.exit(0));
});

gulp.task('default', ['watch']);
