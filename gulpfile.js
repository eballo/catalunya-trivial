//import the necessary gulp plugins
const gulp = require('gulp');
var uglify = require("gulp-uglify"),
  watch = require("gulp-watch"),
  karma = require('karma').Server;

// Karma task to run the tests
gulp.task('karma', function (done) {
  new karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

// Gulp plumber error handler
var onError = function(err) {
  console.log(err);
}

// minify-js
gulp.task('minify-js', function() {
  gulp.src(['./node_modules/js-cookie/src/js.cookie.js', './src/js/*.js']) // path to your files
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
});

// copy css
gulp.task('copy-css', function() {
  gulp.src('./src/css/*')
    .pipe(gulp.dest('./assets/css/'));
});

// Watch
gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['minify-js']);
  gulp.watch('src/css/*', ['copy-css']);
});

// Lets us type "gulp" on the command line and run all of our tasks
gulp.task('default', ['minify-js', 'copy-css']);
