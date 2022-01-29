const { series, parallel, watch, src, dest } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');


const cleanDist = () =>  {
    return src('./dist/*')
        .pipe(clean());
};
const optimImgAndCopy = () => {
    return src('src/img/**')
        .pipe(imagemin())
        .pipe(dest('dist/img'))
};



const serv = () => {
    browserSync.init({
        server: {
            baseDir: "./",
        },
    });
};

const bsReload = (cb) => {
    browserSync.reload();
    cb();
};

const styles = () => {
    return src("./src/main.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("./dist/styles/"))
        .pipe(browserSync.stream());
};
const js = () => {
    return src("./src/*/*.js")
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(dest("./dist/js/"))
        .pipe(browserSync.stream());
};

const watcher = (cb) => {
    watch("./index.html", bsReload);
    watch("./src/**/*.scss", styles);
    watch("./src/**/*.js", js);
    cb();
};

exports.default = parallel(serv, watcher, series(cleanDist, styles, js, optimImgAndCopy));
