const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

// 1. Compile SCSS to CSS and automatically stream changes to browser
function compileSass() {
    return src('src/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// 2. Copy HTML files from src to dist
function copyHtml() {
    return src('src/*.html')
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

// 3. Serve and Watch Files
function serve() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    watch('src/**/*.scss', compileSass);
    watch('src/*.html', copyHtml);
}

// Export tasks so they can be run from terminal
exports.default = series(copyHtml, compileSass, serve);