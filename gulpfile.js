var gulp = require('gulp'),
    args = require('yargs').argv,
    minifyHTML = require('gulp-minify-html');
    path = require('path'),
    config = require('./gulp.config')(),
    mainBowerFiles = require("main-bower-files"),
    browserSync = require("browser-sync");

var $ = require('gulp-load-plugins')({lazy:true});

gulp.task("html", ["bower"], function(){
    log('Minify HTML and inject dependancies' + config.paths.html.src);

    return gulp
        .src(config.paths.html.src)
        .pipe($.inject(
            gulp.src(
                mainBowerFiles(),
                {read: false, cwd: "bower_components"}
            ),
            //{relative: true},
            {name: "bower", addPrefix: "bs_template/build/lib"}
        ))
        .pipe(minifyHTML())
        .pipe(gulp.dest(config.paths.html.dest));
});

gulp.task("scripts", function(){
    return gulp
        .src(config.paths.javascript.src)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.sourcemaps.init())
        .pipe($.concat("app.min.js"))
        .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.paths.javascript.dest));
});

gulp.task("less", function(){
    log('Compile Less');

    return gulp
        .src(config.paths.less.src)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.sourcemaps.init())
        .pipe($.less({
            paths: [config.less_bs_src]
        }))
        .pipe($.concat("main.min.css"))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.paths.css.dest))
        .pipe($.filter("**/*.css"))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task("bower", function(){
    log('Moving Bower files that need to be included in the build');
    
    return gulp
        .src(mainBowerFiles(), {base: "bower_components"})
        .pipe(gulp.dest(config.paths.bower.dest));
});

gulp.task("browser-sync", function() {
    browserSync({
        proxy: "localhost:8888/bs_template/build"
    });
});

gulp.task("default", ["bower", "html", "scripts", "less", "browser-sync"], function(){
    gulp.watch(config.paths.html.src, ["html", browserSync.reload]);
    gulp.watch(config.paths.javascript.src, ["scripts", browserSync.reload]);
    gulp.watch(config.paths.bower.src, ["bower", browserSync.reload]);
 
    gulp.watch(config.paths.less.src, ["less"]);
});


///////////////////////

function log(msg) {
  if (typeof(msg) === 'object') {
      for (var item in msg) {
          if (msg.hasOwnProperty(item)) {
              $.util.log($.util.colors.blue(msg[item]));
          }
      }
    }
    else {
        $.util.log($.util.colors.blue(msg)); 
    }
}