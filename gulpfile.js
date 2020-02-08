"use strict";

var gulp = require("gulp");
var del = require("del");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var htmlmin = require("gulp-htmlmin");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var uglify = require('gulp-uglify')


gulp.task("clean-folder", function () {
  return del("build");
});

gulp.task("copy-files", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
  });

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("images", function (){
  return gulp.src("source/img/**/*.{png,jpg,svg}")
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true}),
        imagemin.svgo()
      ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
    return gulp.src("source/img/**/*.{png,jpg}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task('minify-html', () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
});

gulp.task('uglify', function () {
  return gulp.src('source/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task("server", function () {
  server.init({
    server: "build/"
  });
  gulp.watch("source/sass/**/*.scss", gulp.series("css", "refresh"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("uglify", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "minify-html", "refresh"));
});

gulp.task("build", gulp.series(
  "clean-folder",
  "copy-files",
  "css",
  "images",
  "sprite",
  "webp",
  "html",
  "minify-html",
  "uglify"
));

gulp.task("start", gulp.series(
  "build",
  "server"
));

gulp.task("refresh", function (done) {
  server.reload();
  done();
});
