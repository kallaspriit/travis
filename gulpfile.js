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
			views: 'src/**/*.tsx',
			test: 'test/**/*.ts'
		},
		dir: {
			build: path.join('build'),
			js: path.join('build', 'js'),
			test: path.join('build', 'js', 'test'),
			reference: path.join('build', 'reference'),
			maps: path.join('..', 'maps'),
			cache: path.join('build', 'cache'),
			dist: path.join('build', 'dist'),
			resolveRoot:  path.join('build', 'js', 'src')
		}
	};

// compile TypeScript, see https://github.com/ivogabe/gulp-typescript for options
gulp.task('tsc', function () {
	var typescriptResult = gulp.src([config.files.src, config.files.views, config.files.test])
		.pipe(sourcemaps.init({
			// debug: true
		}))
		.pipe(ts({
			typescript: typescript, // using custom latest typescript version
			noImplicitAny: true,
			target: 'ES6',
			declarationFiles: true,
			outDir: config.dir.js,
			// jsx: 'preserve'
			jsx: 'react'
		}));

	// stop on error
	typescriptResult.on('error', function(e) {
		gutil.log('Compiling TypeScript failed, please check your sources');

		process.exit(1);
	});

	// generate both reference files and JS files with source maps
	return merge([
    	typescriptResult.dts.pipe(gulp.dest(config.dir.reference)),
    	typescriptResult.js
			.pipe(sourcemaps.write(config.dir.maps, {
				sourceRoot: './',
				includeContent: true,
				// debug: true
			}))
			.pipe(gulp.dest(config.dir.js))
    ]);
});

// webpack compilation, see http://webpack.github.io/docs/configuration.html for options
gulp.task('webpack', ['tsc'], function(done) {
	// make sure the babel cache dir exists as it's unable to create it itself
	if (!fs.existsSync(config.dir.build)){
		fs.mkdirSync(config.dir.build);
	}

	if (!fs.existsSync(config.dir.cache)){
		fs.mkdirSync(config.dir.cache);
	}

	var specFiles = glob.sync(path.join(path.resolve(config.dir.test), '*.js'));

    webpack({
		// the base directory (absolute path!) for resolving the entry option
		context: path.resolve(config.dir.js),


		resolve: {
			root: path.resolve(config.dir.resolveRoot)
		},

		// entry points for the bundle
		entry: {
			app: 'app.js',
			test: specFiles
		},
		output: {
			path: path.resolve(config.dir.dist),
			filename: '[name].js',
			devtoolModuleFilenameTemplate: 'app:///[resource-path]',
			pathinfo: true
		},
		module: {
			preLoaders: [
				{
					test: /\.(js|jsx)$/,
					loader: 'source-map-loader'
				}
			],
			loaders: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					loader: 'babel-loader?cacheDirectory=' + config.dir.cache
				}
			]
		},
		devtool: 'source-map'
    }, function(err, stats) {
        if(err) {
			throw new gutil.PluginError('webpack', err);
		}

        /*gutil.log("[webpack]", stats.toString({
            // output options
        }));*/

        done();
    });
});

// rebuilds the project once, does not start watchers or server
gulp.task('build', ['webpack']);

// run tests using Karma
gulp.task('test', ['build'], function (done) {
	var server = new KarmaServer({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done);

	server.start();
});

// watches for file changes and rebuilds as needed
gulp.task('dev', ['build'], function() {
	gulp.watch([config.files.src, config.files.views, config.files.test], ['build']);
});

// default task when executing just "> gulp"
gulp.task('default', ['build']);