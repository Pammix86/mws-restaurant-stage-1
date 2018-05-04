/**
* Gulpfile to make my life easier.
*/
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var webserver = require('gulp-webserver');
var browserSync = require('browser-sync').create();

gulp.task('es6', function() {
	browserify({
    	entries: ['js/main.js', 'js/dbhelper.js', './service-worker.js'],
    	debug: true
  	})
    .transform(babelify, { presets: ['es2015'] })
    .bundle()
    .on('error',gutil.log)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(''));
});
gulp.task('default', ['copy-html', 'copy-images', 'copy-manifest', 'styles', 'lint', 'copy-scripts'], function() {
  gulp.watch('sass/**/*.scss', ['styles']);
  gulp.watch('js/**/*.js', ['lint']);
  gulp.watch('/*.html', ['copy-html']);
  gulp.watch('./dist/*.html').on('change', browserSync.reload);

  browserSync.init({
    server: './dist'
  });
});
gulp.task('dist', [
  'copy-html',
  'copy-images',
  'copy-manifest',
  'styles',
  'copy-scripts',
  'scripts-dist'
]);
gulp.task('copy-scripts', function() {
  gulp.src('js/**/*.js')
    .pipe(gulp.dest('dist/js'));
  gulp.src('service-worker.js')
    .pipe(gulp.dest('dist/'));
});
gulp.task('scripts-dist', function() {
  gulp.src('js/**/*.js')
    .pipe(babel({
    }))
    .pipe(uglify())
    .on('error', function(err) {
      console.log('[ERROR] '+ err.toString() );
    })
    .pipe(gulp.dest('dist/js'));
});
gulp.task('copy-html', function() {
  gulp.src('./*.html')
    .pipe(gulp.dest('./dist'));
});
gulp.task('copy-images', function() {
  gulp.src('images/**/*')
    .pipe(gulp.dest('dist/images'));
    gulp.src('images/icon/*.png')
    .pipe(gulp.dest('dist/images/icon'));
});

gulp.task('copy-manifest', function() {
  gulp.src('./manifest.json')
    .pipe(gulp.dest('./dist'));
});
gulp.task('styles', function() {
  gulp.src('css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('images-process', function() {
  return gulp.src('images/*')
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      host: 'localhost',
      port: 3000,
      livereload: true,
      open: true,
    }));
  });
  gulp.task('lint', function () {
    return gulp.src(['js/**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
  });
  
gulp.task('watch',function() {
	gulp.watch('**/*.js',['es6'])
});
 
gulp.task('default', ['watch']);