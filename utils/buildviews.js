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

module.exports = function (conf) {
	var paths = [],
		plugins = conf.plugins;

	var copy = function (ori, next) {

		ncp( ori, conf.rootPath + '/build/views', function (err) {
			if (err) {
				return console.error(err);
			}
			console.log('done!');
			next( next );
		});
	};

	/* - LOAD PLUGINS - */
	var plugin,
		p; //path view

	deleteFolderRecursive( conf.rootPath + '/build' );
	mkdirp( conf.rootPath + '/build' );
	if (plugins) {
		for (plugin in plugins) {
			p = path.resolve(conf.rootPath, 'plugins', plugins[plugin], 'views');
			if (fs.lstatSync( p ).isDirectory()) {
				paths.push( p + '/' );
			}
		}
		loop( paths, copy, function () {
			console.log( 'plugin views copied' );
			copy( conf.rootPath + '/app/views', function () {
				console.log( 'app views copied' );
			});
		});
	} else {
		copy( conf.rootPath + '/app/views', function () {
			console.log( 'app views copied' );
		});
	}
};
