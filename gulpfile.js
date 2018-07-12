// 获取 gulp
var gulp = require('gulp')
// 获取 gulp-ruby-sass 模块
var sass = require('gulp-ruby-sass')
var rename = require('gulp-rename')
var stylus = require('gulp-stylus')

// 编译sass
// 在命令行输入 gulp sass 启动此任务
const sass_dir = 'pages/**/*.styl'
gulp.task('stylus-go', function() {
    return gulp.src(sass_dir)
        .pipe(stylus())
        .on('error', function (error) {
            console.error(error.toString())

            this.emit('end')
        })
        .pipe(rename({
            extname: ".wxss"
        }))

        .pipe(gulp.dest('pages'))
});

// 在命令行使用 gulp auto 启动此任务
gulp.task('stylus-run', function () {
    // 监听文件修改，当文件被修改则执行 images 任务
    gulp.watch(sass_dir, ['stylus-go'])
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 sass 任务和 auto 任务
// gulp.task('default', ['sass', 'auto'])