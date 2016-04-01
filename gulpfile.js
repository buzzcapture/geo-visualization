"use strict";

var _, watchify, browserify, babelify,
    gulp, source, buffer, gutil, sourcemaps,
    watch, sass, uglify, webserver, babel,

    options, bundler;

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

options = {
  fullPaths: false,
  extensions: [".js", ".jsx"],
  entries: ["./index.js"],
  debug: true
};

bundler = browserify(options);
bundler.transform(babelify);

gulp.task("build", function() {
  bundleComponent();
});

bundler.on("log", gutil.log);

function bundleComponent () {
  return gulp.src([
                "src/js/components/map.jsx",
                "src/js/components/leafletmap.js"
              ])
             .pipe(babel())
             .pipe(gulp.dest("./dist"));
}