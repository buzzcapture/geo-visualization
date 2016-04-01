"use strict";

var _, browserify, babelify,
    gulp, source, buffer, gutil,
    babel, options, bundler;

_ = require("lodash");

browserify = require("browserify");
babelify = require("babelify");

gulp = require("gulp");
babel = require("gulp-babel");
gutil = require("gulp-util");

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
  return gulp.src("./src/*")
             .pipe(babel())
             .pipe(gulp.dest("./dist"));
}