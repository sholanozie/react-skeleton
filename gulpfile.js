var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var paths = {
	index: 'src/index.js',
	dest: 'public/',
	src: 'src/',
	static: 'src/assets/**'
};

gulp.task('clean', function () {
	return del.sync(paths.dest + '*');
});

gulp.task('build', ['clean'], function () {
	return browserify({entries: paths.index, extensions: ['.jsx'], debug: true})
			.transform(babelify)
			.bundle()
		.pipe(source('bundle.min.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.dest));
});

gulp.task('static', ['clean'], function () {
	return gulp.src(paths.static)
		.pipe(gulp.dest(paths.dest));
});

gulp.task('default', ['clean', 'static', 'build']);
