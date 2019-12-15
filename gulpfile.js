// gulpプラグインの読み込み
const gulp = require("gulp");
// Sassをコンパイルするプラグインの読み込み
const sass = require("gulp-sass");
// プリフィックスをいい感じにつけてくれる
const autoprefixer = require('gulp-autoprefixer'); 
// エラーが出た時にタスクを止めないための処理
const plumber = require('gulp-plumber');      
const progeny = require('gulp-progeny');      
// ソースマップを作ってくれる
const sourcemaps = require('gulp-sourcemaps');   
// 画像を圧縮するプラグインの読み込み
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const imageminJpg = require('imagemin-jpeg-recompress');
const imageminPng = require('imagemin-pngquant');
const imageminGif = require('imagemin-gifsicle');
const svgmin = require('gulp-svgmin');
// JavaScriptを結合・圧縮するプラグインの読み込み
// const concat = require('gulp-concat');
// const jshint = require('gulp-jshint');
// const rename = require('gulp-rename');
// const uglify = require('gulp-uglify');
// ブラウザのオートリロードするプラグインの読み込み
const browserSync = require('browser-sync');


// Sassコンパイル
gulp.task('sass', function (done) { 
   gulp.src('./src/assets/sass/**/*.scss') 
      // エラーが発生してもタスクを止めないおまじない
      .pipe(plumber()) 
      // パーシャルしたSCSSファイルを変更して保存した際にも親SCSSファイルをコンパイルする
      .pipe(progeny()) 
      // sourcemapの書き出し→まず初期化→writeで書き出し
      .pipe(sourcemaps.init()) 

      // Sassコンパイルを行う
      .pipe(sass({ 
         outputStyle: 'expanded'
      }))



      .pipe(autoprefixer({ 
         overrideBrowserslist: [
            "last 2 version",
            "> 5%",
            "iOS 7",
            "Android 4",
            "IE 8"
         ]
      }))
      // sourcemapの書き出し→まず初期化→writeで書き出し
      .pipe(sourcemaps.write()) 
      // CSSを書き出し
      .pipe(gulp.dest('./css')) 
      done();
});

// 画像を圧縮
gulp.task('imagemin', function (done) {
   // jpg,jpeg,png,gif を指定
   gulp.src('./src/assets/images/**/*.+(jpg|jpeg|png|gif)') 
      // 書き出し先フォルダから変更があるかチェック
      .pipe(changed('./images')) 
      // 画像の圧縮
      .pipe(imagemin([ 
         imageminPng(),
         imageminJpg(),
         imageminGif({
            interlaced: false,
            optimizationLevel: 3,
            colors: 180
         })
      ]))
      .pipe(gulp.dest('./images/'));
   // svg を指定して圧縮
   gulp.src('./src/assets/images/**/*.+(svg)') 
      .pipe(changed('./images'))
      .pipe(svgmin()) 
      .pipe(gulp.dest('./images/'));
      done();
});

// JavaScriptを結合・圧縮する
// concat js file(s)
// gulp.task('js.concat', function (done) {
//    gulp.src([
//       './src/assets/js/sample.js' // 1
//    ])
//       .pipe(plumber())
//       .pipe(jshint()) // 2
//       .pipe(jshint.reporter('default')) // 2
//       .pipe(concat('bundle.js')) // 3
//       .pipe(gulp.dest('./js'));
//       done();
// });

// // compress js file(s)
// gulp.task('js.compress', function (done) {
//    gulp.src('./js/bundle.js')
//       .pipe(plumber())
//       .pipe(uglify()) // 4
//       .pipe(rename('bundle.min.js')) // 5
//       .pipe(gulp.dest('./js'));
//       done();
// });


// Browser Sync
gulp.task('bs', function(done) {
    browserSync({
        server: { // 1
            baseDir: "./",
            index: "index.html"
        }
    });
    done();
});

// Reload Browser
gulp.task( 'bs-reload', function(done) {
    browserSync.reload(); 
   done();
});



// Default task
gulp.task('default', gulp.series(gulp.parallel('bs', 'sass', 'imagemin'), function () { 
   // htmlファイルに変更があればブラウザをリロードする
   gulp.watch("./*.html", gulp.task('bs-reload')); 
   // Sassファイルに変更があればコンパイルしてブラウザをリロードする
   gulp.watch("./src/assets/sass/**/*.scss", gulp.parallel('sass', 'bs-reload')); 
   // JavaScriptファイルに変更があれば、結合・圧縮してブラウザをリロードする
   // gulp.watch("./src/assets/js/*.js", gulp.task('js.concat', 'js.compress', 'bs-reload')); 
   // 画像ファイルに変更があれば、圧縮をしてブラウザをリロードする
   gulp.watch("./src/assets/image/*", gulp.parallel('imagemin', 'bs-reload')); 
}));




// // gulpプラグインの読み込み
// const gulp = require("gulp");
// // Sassをコンパイルするプラグインの読み込み
// const sass = require("gulp-sass");
// // style.scssの監視タスクを作成する
// gulp.task("default", function () {
//    // ★ style.scssファイルを監視
//    return gulp.watch("./src/assets/sass/**/*.scss", function () {
//       // style.scssの更新があった場合の処理

//       // style.scssファイルを取得
//       return (
//          gulp
//             .src("./src/assets/sass/**/*.scss")
//             // Sassのコンパイルを実行
//             .pipe(
//                sass({
//                   outputStyle: "expanded"
//                })
//                   // Sassのコンパイルエラーを表示
//                   // (これがないと自動的に止まってしまう)
//                   .on("error", sass.logError)
//             )
//             // cssフォルダー以下に保存
//             .pipe(gulp.dest("css"))
//       );
//    });
// });