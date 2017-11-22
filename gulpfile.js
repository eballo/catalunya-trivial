//import the necessary gulp plugins
var gulp = require('gulp'),
  uglify = require("gulp-uglify");
  watch = require("gulp-watch");

// Gulp plumber error handler
var onError = function(err) {
  console.log(err);
}

// minify-js
gulp.task('minify-js', function() {
  gulp.src(['./node_modules/js-cookie/src/js.cookie.js','./src/js/*.js']) // path to your files
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
});

// copy css
gulp.task('copy-css', function () {
    gulp.src('./src/css/*')
        .pipe(gulp.dest('./assets/css/'));
});

// Watch
gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['minify-js'])
});

// Lets us type "gulp" on the command line and run all of our tasks
gulp.task('default', ['minify-js','copy-css']);
