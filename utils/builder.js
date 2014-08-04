'use strict';

var ncp = require('ncp').ncp,
	fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp');

ncp.limit = 1;

var loop = function (arr, fn, cb) {
	var count = 0,
		limit = arr.length;

	var next = function (self) {
		if (count === limit) {
			return cb();
		}
		fn( arr[count++], self );
	};

	next( next );
};


var deleteFolderRecursive = function (path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach( function (file) {
			var curPath = path + '/' + file;
			if (fs.statSync( curPath ).isDirectory()) {
				return deleteFolderRecursive( curPath );
			} else {
				return fs.unlinkSync( curPath );
			}
		});
		return fs.rmdirSync( path );
	}
};

var getCopy = function (dir) {
	return function (ori, next) {
		var viewsOrigin = path.resolve( dir, 'plugins', ori, 'views' ),
			publicOrigin = path.resolve( dir, 'plugins', ori, 'public' );

		ncp( viewsOrigin, dir + '/build/views', function (err) {
			if (err) {
				console.error(err);
			}
			console.log('done views: ' + viewsOrigin );
			ncp( publicOrigin, dir + '/build/public', function (err2) {
				if (err2) {
					console.error(err2);
				}
				console.log('done views: ' + publicOrigin );
				next( next );
			});
		});
	};
};


module.exports = function (plugins, dir) {
	var paths = [],
		copy = getCopy( dir ),
		p;

	// - copy views and plublic folders from plugins
	deleteFolderRecursive( dir + '/build' );
	mkdirp( dir + '/build' );

	if (plugins) {
		for (p in plugins) {
			paths.push( plugins[p] );
		}
		loop( paths, copy, function () {
			console.log( 'plugin views copied' );
			// - copy views and plublic folders from app
			copy( dir + '/app', function () {
				console.log( 'app views copied' );
			});
		});
	} else {
		// - copy views and plublic folders from app
		copy( dir + '/app', function () {
			console.log( 'app views copied' );
		});
	}
};
