import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import favicons from "gulp-favicons";
// Styles

export const styles = () => {
  return gulp
    .src("source/scss/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("source/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// Favicons
export const setFavicons = () => {
  return gulp
    .src("source/img/favicon.png")
    .pipe(
      favicons({
        appName: "Cat Energy",
        appShortName: "CE",
        background: "#020307",
        path: "favicons/",
        url: "http://haydenbleasel.com/",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/?homescreen=1",
        version: 1.0,
        html: "source/index.html",
        pipeHTML: true,
      })
    )
    .pipe(gulp.dest("./source/img/favicons"));
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "source",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/scss/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html").on("change", browser.reload);
};

// Build

export default gulp.series(styles, setFavicons, server, watcher);
