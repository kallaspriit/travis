var gulp = require('gulp'),
	gutil = require('gulp-util'),
	typescript = require('typescript'),gu
	ts = require('gulp-typescript'),
	merge = require('merge2'),
	karma = require('karma').server,
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
		.pipe(ts({
			typescript: typescript, // using custom latest typescript version
			noImplicitAny: true,
			//target: 'ES5',
			//module: 'commonjs',
			target: 'ES6',
			outDir: 'src',
			declarationFiles: true
		}));

	return merge([
    	typescriptResult.dts.pipe(gulp.dest('reference')),
    	typescriptResult.js.pipe(gulp.dest('dist'))
    ]);
});

// webpack compilation
gulp.task('webpack', ['tsc'], function(done) {
    webpack({
		context: path.join(__dirname, 'dist', 'src'),
		entry: './app',
		output: {
			path: path.join(__dirname, 'build'),
			filename: 'bundle.js'
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
		devtool: 'eval'
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
gulp.task('test', ['tsc'], function (done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, function () {
		done();
	});
});

// watches for file changes and rebuilds as needed
gulp.task('dev', ['tsc'], function() {
	gulp.watch([config.files.src, config.files.test], ['webpack']);
});

// default task when executing just "> gulp"
gulp.task('default', ['dev']);