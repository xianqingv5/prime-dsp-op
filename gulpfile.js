const gulp = require('gulp')
//var extender = require('gulp-html-extend')  //Make it easy to extend, include and replace your html files
const runSequence = require('gulp-run-sequence');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const moment = require('moment');
const minifyCss = require('gulp-minify-css');                     //- 压缩CSS为一行；
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');                              //Babel是一个广泛使用的ES6转码器，可以将ES6代码转为ES5代码，从而在现有环境执行。
const source_path = './dev';     //开发环境
const temp_path = './dev';  //暂存环境
const dist_path = './dist';    //测试环境
const production_path = './production';    //测试环境
const watchSourceFiles = [
	source_path + '/*.html',
	source_path + '/static/script/*.js',
	source_path + '/static/css/*.css',
	source_path + '/static/widget/**/*.js',
	source_path + '/static/widget/**/*.html',
	source_path + '/static/widget/**/*.css',
]
const watchOutputFiles = [
	temp_path + '/*.html',
	temp_path + '/static/script/*.js',
	temp_path + '/static/css/*.css',
	temp_path + '/static/widget/**/*.js',
	temp_path + '/static/widget/**/*.html',
	temp_path + '/static/widget/**/*.css',
]

const babelConfig = {
	presets: ['es2015'],
	comments: false,
	babelrc: false,
	ast: false
}

const log = function () { console.log(arguments) }

// 本地运营接口地址
const dev_api_host = 'http://192.168.1.185:8081/dsp-op';
// infi
// const dev_api_host = 'http://172.30.88.166:8888';
// adam
// const dev_api_host = 'http://172.30.89.174:8888';
// 线上
// const dev_api_host = 'http://primemanager.yeahmobi.com/dsp-op';

// 本地投放系统地址
const dev_prime_host = 'http://dev.dsp.com:3000/static';



function htmlminOptions() {
	var options = {
		decodeEntities: true,
		html5: true,
		minifyCSS: true,
		minifyJS: true,
		collapseBooleanAttributes: true,
		collapseWhitespace: false,
		decodeEntities: true,
		html5: true,
		minifyCSS: true,
		minifyJS: true,
		processConditionalComments: true,
		removeAttributeQuotes: true,
		removeComments: true,
		removeEmptyAttributes: false,
		removeOptionalTags: true,
		// removeRedundantAttributes:true,
		removeScriptTypeAttributes: false,
		removeStyleLinkTypeAttributes: false,
		removeTagWhitespace: false,
		sortAttributes: true,
		sortClassName: true,
		useShortDoctype: true,
	}
	return options;
}


//elaine copy all html,css&js(编译ES6) to dist(测试文件)
gulp.task('extend-dist', done => {
	gulp.src([temp_path + '/static/script/*.js', '!' + temp_path + '/static/script/common.js'])
		.pipe(babel(babelConfig))
		.on('error', swallowError)
		.pipe(gulp.dest(dist_path + '/static/script/'))

	gulp.src(temp_path + '/static/widget/**/*.js')
		.pipe(babel(babelConfig))
		.on('error', swallowError)
		.pipe(gulp.dest(dist_path + '/static/widget'))

	//修改测试环境api_host
	gulp.src([temp_path + '/static/script/common.js'])
		.pipe(babel(babelConfig))
		.pipe(replace('{api_host}', dev_api_host))
		.pipe(replace('{prime_host}', dev_prime_host))
		.on('error', swallowError)
		.pipe(gulp.dest(dist_path + '/static/script/'))

	gulp.src([temp_path + '/**/*.*',
	'!' + temp_path + '/static/script/*.js',
	'!' + temp_path + '/static/widget/**/*.js',
	'!' + temp_path + '/*.html'])
		.on('error', swallowError)
		.pipe(gulp.dest(dist_path))

	var hash = moment().format('YYYYMMDDHHmmss');
	gulp.src([temp_path + '/*.html'])
		.pipe(replace('<!-- hash -->', hash))
		.on('error', swallowError)
		.pipe(gulp.dest(dist_path))
	done()
})

//elaine 打包到测试环境
// gulp.task('watch', ['extend-dist'], function () {
//     console.log('watch');
//     // gulp.watch(temp_path + '/**/*.*', ['extend-dist'])
//     gulp.watch(watchSourceFiles, ['extend-dist'])
// })
gulp.task('watch', gulp.series('extend-dist', done => {
	console.log('watch');
	// gulp.watch(temp_path + '/**/*.*', ['extend-dist'])
	gulp.watch(watchSourceFiles, gulp.series('extend-dist', done => {
		done()
	}))
	done()
}))

function swallowError(error) {

	// If you want details of the error in the console
	console.log(error.toString())

	this.emit('end')
}

//copy & minify html
gulp.task('minifyHtml', done => {
	console.log('minifyHtml');
	gulp.src([temp_path + '/static/widget/**/*.html'])
		.pipe(htmlmin(htmlminOptions()))
		.pipe(gulp.dest(production_path + '/static/widget'))


	gulp.src([temp_path + '/*.html',
	'!' + temp_path + '/index.html'])
		.pipe(htmlmin(htmlminOptions()))
		.pipe(gulp.dest(production_path))
	done()
})

//copy & minify all custormer css
gulp.task("cssMin", done => {
	console.log('cssMin');
	gulp.src([temp_path + '/static/css/*.css'])
		.pipe(minifyCss())
		.pipe(gulp.dest(production_path + '/static/css'))

	gulp.src([temp_path + '/static/widget/**/*.css'])
		.pipe(minifyCss())
		.pipe(gulp.dest(production_path + '/static/widget/'))
	done()
})

//copy & uglify all js
gulp.task("uglifyJS", done => {
	console.log('uglifyJS');
	gulp.src([temp_path + '/static/script/*.js', '!' + temp_path + '/static/script/common.js'])
		.pipe(babel(babelConfig))
		.pipe(uglify())
		.pipe(gulp.dest(production_path + '/static/script/'))

	gulp.src(temp_path + '/static/widget/**/*.js')
		.pipe(babel(babelConfig))
		.pipe(uglify())
		.pipe(gulp.dest(production_path + '/static/widget'))
	done()
})

//copy other files
gulp.task("copyOtherFiles", done => {
	console.log('copyOtherFiles');
	gulp.src([
		temp_path + '/**/*.*',
		'!' + temp_path + '/static/css/*.css',
		'!' + temp_path + '/static/script/*.js',
		'!' + temp_path + '/static/widget/**/*.js',
		'!' + temp_path + '/static/widget/**/*.css',
		'!' + temp_path + '/*.html',
		'!' + temp_path + '/static/widget/**/*.html'
	])
		.pipe(gulp.dest(production_path))
	done()
})


//发布到线上，增加版本信息，修改api_host
gulp.task("pro_env", done => {
	var hash = moment().format('YYYYMMDDHHmmss');
	gulp.src([temp_path + '/index.html'])
		.pipe(replace('<!-- hash -->', hash))
		.pipe(htmlmin(htmlminOptions()))
		.pipe(gulp.dest(production_path))


	gulp.src([temp_path + '/static/script/common.js'])
		// .pipe(replace('{api_host}', test_api_host))
		// .pipe(replace('{prime_host}', test_prime_host))
		.pipe(babel(babelConfig))
		.pipe(uglify())
		.pipe(gulp.dest(production_path + '/static/script/'))
	done()
})

//elaine 打包到正式环境
// gulp.task('extend-pro' , ['cssMin', 'uglifyJS', 'copyOtherFiles', 'minifyHtml'], function () {
// })
gulp.task('extend-pro', gulp.series('cssMin', 'uglifyJS', 'copyOtherFiles', 'minifyHtml', done => {
	done()
}))

//打包到正式环境
// gulp.task('default', ['extend-pro', 'pro_env'], function () {
//     var hash = moment().format('YYYYMMDDHHmmss');
// 	console.log('hash:' + hash);
// })
gulp.task('default', gulp.parallel('extend-pro', 'pro_env', done => {
	var hash = moment().format('YYYYMMDDHHmmss');
	console.log('hash:' + hash);
	done()
}))