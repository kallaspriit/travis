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
		},
		dir: {
			build: path.join('build'),
			js: path.join('build', 'js'),
			test: path.join('build', 'js', 'test'),
			reference: path.join('build', 'reference'),
			maps: path.join(__dirname, 'build', 'maps'),
			cache: path.join('build', 'cache'),
			dist: path.join('build', 'dist'),
			resolveRoot:  path.join('build', 'js', 'src')
		}
	};

// compile TypeScript
gulp.task('tsc', function () {
	var typescriptResult = gulp.src([config.files.src, config.files.test])
		.pipe(sourcemaps.init())
		.pipe(ts({
			typescript: typescript, // using custom latest typescript version
			noImplicitAny: true,
			target: 'ES6',
			declarationFiles: true,
			outDir: config.dir.js
		}));

	return merge([
    	typescriptResult.dts.pipe(gulp.dest(config.dir.reference)),
    	typescriptResult.js
			.pipe(sourcemaps.write(config.dir.maps))
			.pipe(gulp.dest(config.dir.js))
    ]);
});

// webpack compilation
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
		context: path.resolve(config.dir.js),
		resolve: {
			root: path.resolve(config.dir.resolveRoot)
		},
		entry: {
			app: 'app.js',
			test: specFiles
		},
		output: {
			path: path.resolve(config.dir.dist),
			filename: '[name].js'
		},
		module: {
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

        gutil.log("[webpack]", stats.toString({
            // output options
        }));

        done();
    });
});

// watches for file changes and rebuilds as needed
gulp.task('build', ['tsc', 'webpack']);

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
	gulp.watch([config.files.src, config.files.test], ['build']);
});

// default task when executing just "> gulp"
gulp.task('default', ['dev']);