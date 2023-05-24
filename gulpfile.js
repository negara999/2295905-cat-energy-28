import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import favicons from "gulp-favicons";
import svgSprite from "gulp-svg-sprite";
import minify from "gulp-htmlmin";
import terser from "gulp-terser";
import squoosh from "gulp-libsquoosh";
import svgo from "gulp-svgo";
import svgstore from "gulp-svgstore";
import rename from "gulp-rename";
import del from "gulp-clean";

// Styles

export const styles = () => {
  return gulp
    .src("source/scss/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// HTML

const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(minify({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

// Scripts
const scripts = () => {
  return gulp.src("source/js/*.js").pipe(terser()).pipe(gulp.dest("build"));
};

// Images
const optimizeImages = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"));
};

const copyImages = () => {
  return gulp.src("source/img/**/*.{jpg,png}").pipe(gulp.dest("build/img"));
};

//WebP
const createWebp = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(
      squoosh({
        webp: {},
      })
    )
    .pipe(gulp.dest("build/img"));
};

// SVGSprite
const svg = () => {
  return gulp.src("source/img/*.svg").pipe(svgo()).pipe(gulp.dest("build/img"));
};

const sprite = () => {
  return gulp
    .src("source/img/*.svg")
    .pipe(svgo())
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

// Copy
const copyFiles = () => {
  return gulp.src(["source/**/**/*"]).pipe(gulp.dest("build/"));
};

// Favicons
const setFavicons = () => {
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

// Clean
export const clean = () => {
  return gulp.src("build").pipe(del("build"));
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
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
  gulp.watch("source/script.js"), gulp.series(scripts);
  gulp.watch("source/*.html").on("change", browser.reload);
};

// Build

export const build = gulp.series(
  clean,
  copyFiles,
  optimizeImages,

  gulp.parallel(styles, html, scripts, createWebp, setFavicons, sprite)
);

// Default
export default gulp.series(
  clean,
  copyFiles,
  copyImages,
  gulp.parallel(styles, html, scripts, createWebp, setFavicons, sprite),
  gulp.series(server, watcher)
);
