var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	karma = require('karma').server,
	config = {
		files: {
			src: 'src/**/*.ts',
			test: 'test/**/*.ts'
		}
	};

// compile TypeScript
gulp.task('tsc', function () {
	var typescriptResult = gulp.src([config.files.src, config.files.test])
		.pipe(ts({
			noImplicitAny: true,
			target: 'ES6',
			outDir: 'src',
			module: 'commonjs'
		}));

	return typescriptResult.js.pipe(gulp.dest('dist'));
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
	gulp.watch([config.files.src, config.files.test], ['tsc']);
});

// default task when executing just "> gulp"
gulp.task('default', ['dev']);