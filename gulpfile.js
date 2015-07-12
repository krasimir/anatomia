var gulp = require('gulp');
var shell = require('gulp-shell');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

gulp.task('watchers', function () {
  gulp.watch('./node_modules/acorn/src/**/*.js').on('change', compileAcorn)
});

var compileAcorn = function () {
  gutil.log('Compiling acorn');
  exec(
    'npm run prepublish',
    { cwd: './node_modules/acorn' },
    function(error, stdout, stderr) {
      gutil.log(stdout);  
    }
  );
};

gulp.task('default', ['watchers']);
compileAcorn();