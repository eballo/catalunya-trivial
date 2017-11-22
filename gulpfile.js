//import the necessary gulp plugins
var gulp = require('gulp'),
  uglify = require("gulp-uglify");

// Gulp plumber error handler
var onError = function(err) {
  console.log(err);
}

// minify-js
gulp.task('minify-js', function() {
  gulp.src('./node_modules/js-cookie/src/js.cookie.js') // path to your files
    .pipe(uglify())
    .pipe(gulp.dest('./js/'));
});

// Lets us type "gulp" on the command line and run all of our tasks
gulp.task('default', ['minify-js']);
