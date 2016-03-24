"use strict";

var _, watchify, browserify, babelify,
    gulp, source, buffer, gutil, sourcemaps,
    watch, sass, uglify, webserver, babel,

    customOptions, options, bundler;

_ = require("lodash");

watchify = require("watchify");
browserify = require("browserify");
babelify = require("babelify");

gulp = require("gulp");
babel = require("gulp-babel");
webserver = require("gulp-webserver");
uglify = require("gulp-uglify");
gutil = require("gulp-util");
watch = require("gulp-watch");
sass = require("gulp-sass");
sourcemaps = require("gulp-sourcemaps");

source = require("vinyl-source-stream");
buffer = require("vinyl-buffer");

customOptions = {
  entries: ["./index.js"],
  debug: true
};

options = _.assign({
  fullPaths: false,
  extensions: [".js", ".jsx"]
}, watchify.args, customOptions);

bundler = watchify(browserify(options));

// Add transformations here.
bundler.transform(babelify);

gulp.task("watch", ["css", "html"], function() {
  bundle();
  bundleComponent();

  gulp.watch("./src/styles/**/*.scss", ["css"]);
  gulp.watch("./src/html/index.html", ["html"]);
});

gulp.task("css", css);
gulp.task("html", html);
gulp.task("runserver", runserver);

bundler.on("update", bundle);
bundler.on("update", bundleComponent);
bundler.on("log", gutil.log);

function runserver () {
  gulp.src("./demo")
      .pipe(webserver({
        fallback: "index.html",
        livereload: true
      }));
}

function html () {
  return gulp.src("./src/html/**/*.html")
    .on("log", gutil.log)
    .pipe(gulp.dest("./demo"));
}

function css () {
  return gulp.src("./src/styles/index.scss")
    .on("log", gutil.log)
    .on("error", gutil.log.bind(gutil, "CSS Error"))
    .pipe(sass())
    .pipe(gulp.dest("./demo/css"));
}

function bundleComponent () {
  return gulp.src([
                "src/js/components/map.jsx",
                "src/js/components/leafletmap.js"
              ])
             .pipe(babel())
             .pipe(gulp.dest("./dist"));
}

function bundle () {
  return bundler.bundle()
    .on("error", gutil.log.bind(gutil, "Browserify Error"))
    .pipe(source("build.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))

    // Add transformation tasks to the pipeline here.
    //.pipe(uglify())

    .pipe(sourcemaps.write("./", { debug: true }))
    .pipe(gulp.dest("./demo/js"));
}