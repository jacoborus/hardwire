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
		fs.readdirSync(path).forEach( function (file, index) {
			var curPath = path + "/" + file;
			if (fs.statSync( curPath ).isDirectory()) {
				return deleteFolderRecursive( curPath );
			} else {
				return fs.unlinkSync( curPath );
			}
		});
		return fs.rmdirSync( path );
	}
};


module.exports = function (config) {
	var paths = [],
		plugins = config.plugins;

	var copy = function (ori, next) {
		var viewsOrigin = path.resolve( config.rootPath, 'plugins', ori, 'views' ),
			publicOrigin = path.resolve( config.rootPath, 'plugins', ori, 'public' );

		ncp( viewsOrigin, config.rootPath + '/build/views', function (err) {
			if (err) {
				console.error(err);
			}
			console.log('done views: ' + viewsOrigin );
			ncp( publicOrigin, config.rootPath + '/build/public', function (err2) {
				if (err2) {
					console.error(err2);
				}
				console.log('done views: ' + publicOrigin );
				next( next );
			});
		});
	};

	/* - LOAD PLUGINS - */
	var plugin,
		p; //path view

	deleteFolderRecursive( config.rootPath + '/build' );
	mkdirp( config.rootPath + '/build' );

	if (plugins) {
		for (plugin in plugins) {
			paths.push( plugins[plugin] );
		}
		loop( paths, copy, function () {
			console.log( 'plugin views copied' );
			copy( config.rootPath + '/app', function () {
				console.log( 'app views copied' );
			});
		});
	} else {
		copy( config.rootPath + '/app', function () {
			console.log( 'app views copied' );
		});
	}
};
