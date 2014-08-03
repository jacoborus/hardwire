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

var getCopy = function (config) {
	return function (ori, next) {
		console.log(ori);
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
};



// get module folders
var getModuleFolders = function () {
	var folders = [],
		nmPath = path.resolve('./node_modules'),
		f, len, files;

	if (fs.existsSync( nmPath)) {
		files = fs.readdirSync( nmPath );
		len = files.length;
		for (f in files) {
			if (fs.statSync( nmPath + '/' + files[f] ).isDirectory()) {
				folders.push( nmPath + '/' + files[f] );
			}
		}
	}
	return folders;
};


// get plugin folders
var getPluginFolders = function (plugins) {
	var folders = getModuleFolders( plugins ),
		pPaths = {},
		f;

	for (f in folders) {
		if (fs.existsSync( folders[f] + '/hw-plugin.json' )) {
			pPaths[require(folders[f] + '/hw-plugin.json').name] = folders[f];
		}
	}
	return pPaths;
};

module.exports = function (config) {
	var paths = [],
		plugins = config.plugins,
		pFolders = getPluginFolders( config.plugins ),
		copy = getCopy( config ),
		p;

	// - copy views and plublic folders from plugins
	deleteFolderRecursive( config.rootPath + '/build' );
	mkdirp( config.rootPath + '/build' );

	if (plugins) {
		for (p in plugins) {
			paths.push( pFolders[plugins[p]] );
		}
		loop( paths, copy, function () {
			console.log( 'plugin views copied' );
			// - copy views and plublic folders from app
			copy( config.rootPath + '/app', function () {
				console.log( 'app views copied' );
			});
		});
	} else {
		// - copy views and plublic folders from app
		copy( config.rootPath + '/app', function () {
			console.log( 'app views copied' );
		});
	}
};
