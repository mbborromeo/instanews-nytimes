/**
 * Source: https://red-wdp.herokuapp.com/slides/04-sass/#36
 *
 * Install these packages in NPM first using 'npm install',
 * then load/require them here
 */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');
const terser = require('gulp-terser');
const rename = require('gulp-rename');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const prettyError = require('gulp-prettyerror');
const cssnano = require('gulp-cssnano');


/**
 * Define Gulp tasks
 */
gulp.task('lint', function() {
    return gulp
    .src('./js/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('scripts', function() {
    return gulp
    .src('./js/*.js') // What files do we want gulp to consume?
    .pipe(terser()) // Call the terser function on these files
    .pipe(rename({ extname: '.min.js' })) // Rename the uglified file
    .pipe(gulp.dest('./build/js')); // Where do we put the result?
});

gulp.task('reload', function(done) {
    browserSync.reload();
    done();
});

// Run on your localhost at http://localhost:3000/
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('sass', function() {
    return gulp
        .src('./sass/style.scss')
        .pipe(prettyError())            // ADD THIS LINE to output readable error message
        .pipe(sass())                   // compile SASS and convert to CSS
        .pipe(autoprefixer())           // add CSS vendor prefixes - need to include parameters...
        .pipe(cssnano())                // minify CSS
        .pipe(rename('style.min.css'))  // rename file
        .pipe(gulp.dest('./build/css')); // save file to destination folder
});

gulp.task('watch', function() {
    gulp.watch('./js/*.js', gulp.series('lint', 'scripts', 'reload'));
    gulp.watch('./*.html', gulp.series('reload'));
    // Watch Sass files. If there are changes, run the styles task, then reload
    gulp.watch('./sass/*.scss', gulp.series('sass', 'reload')); // changed folder to point to sass, and added 'sass' task as first step of series
});


/**
 * First run the scripts and the styles/SASS task. Then watch for changes
 */ 
gulp.task('default', gulp.parallel('scripts', 'sass', 'watch', 'browser-sync'));
