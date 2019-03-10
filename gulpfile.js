var gulp = require('gulp');
var sass = require("gulp-sass");
var csso = require('gulp-csso');
var rename = require("gulp-rename");
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");
var del = require("del");
var jso = require("gulp-minify");
var plumber = require("gulp-plumber");
var server = require("browser-sync").create();


gulp.task("css", function () {
    return gulp.src("src/scss/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
});

gulp.task("jso", function() {
    return gulp.src("build/js/**/*.js")
        .pipe(jso())
        .pipe(gulp.dest('build/js'))
});

gulp.task("server", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("src/scss/**/*.{scss,sass}", gulp.series("css")),
    gulp.watch("src/*.html").on("change", server.reload);
});

gulp.task("clean", function () {
    return del ("build");
});

gulp.task("copy", function () {
    return gulp.src([
				"src/fonts/**/*.{woff,woff2,ttf}",
    		"src/img/**",
        "src/js/**",
        "src/*.html"
    ], {
        base: "src"
    })
        .pipe(gulp.dest("build"))
});

gulp.task("build", gulp.series(
    "clean",
    "copy",
    "css",
    "jso"
));

gulp.task("start", gulp.series("build", "server"));
