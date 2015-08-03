var gulp = require('gulp'),
	gutil = require('gulp-util'),
	fs = require('fs'),
	glob = require('glob'),
	typescript = require('typescript'),
	ts = require('gulp-typescript'),
	sourcemaps = require('gulp-sourcemaps'),
	merge = require('merge2'),
	KarmaServer = require('karma').Server,
	webpack = require('webpack'),
	path = require('path'),
	WebpackDevServer = require('webpack-dev-server'),
	config = {
		files: {
			src: 'src/**/*.ts',
			test: 'test/**/*.ts'
		}
	},
	webpackCacheDir = path.join(__dirname, 'cache');

// compile TypeScript
gulp.task('tsc', function () {
	var typescriptResult = gulp.src([config.files.src, config.files.test])
		.pipe(sourcemaps.init())
		.pipe(ts({
			typescript: typescript, // using custom latest typescript version
			noImplicitAny: true,
			//target: 'ES5',
			//module: 'commonjs',
			target: 'ES6',
			outDir: 'src',
			declarationFiles: true, // TODO is this needed?
			//sourceMap: true,
			outDir: 'dist/'
		}));

	return merge([
    	typescriptResult.dts.pipe(gulp.dest('reference')),
    	typescriptResult.js
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('dist'))
    ]);
});

// webpack compilation
gulp.task('webpack', ['tsc'], function(done) {
	// make sure the babel cache dir exists as it's unable to create it itself
	if (!fs.existsSync(webpackCacheDir)){
		fs.mkdirSync(webpackCacheDir);
	}

	var specFiles = glob.sync(path.join(__dirname, 'dist', 'test', '*.js'));

    webpack({
		context: path.join(__dirname, 'dist'),
		entry: {
			app: './src/app',
			test: specFiles
		},
		output: {
			path: path.join(__dirname, 'build'),
			filename: '[name].js'
		},
		module: {
			loaders: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					loader: 'babel-loader?cacheDirectory=' + webpackCacheDir
				}
			]
		},
		resolve: {
			root: path.join(__dirname, 'dist', 'src')
		},
		devtool: 'source-map'
    }, function(err, stats) {
        if(err) {
			throw new gutil.PluginError('webpack', err);
		}

        gutil.log("[webpack]", stats.toString({
            // output options
        }));

        done();
    });
});

// run tests using Karma
gulp.task('test', ['webpack'], function (done) {
	var server = new KarmaServer({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done);

	server.start();
});

// watches for file changes and rebuilds as needed
gulp.task('build', ['tsc', 'webpack']);

// watches for file changes and rebuilds as needed
gulp.task('dev', ['build'], function() {
	gulp.watch([config.files.src, config.files.test], ['build']);
});

// default task when executing just "> gulp"
gulp.task('default', ['dev']);