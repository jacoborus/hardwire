'use strict';

/* TODO: refactor this mess*/


var ncp = require('ncp').ncp,
	fs = require('fs'),
	mkdirp = require('mkdirp');

ncp.limit = 1;

var groupFolders = ['config', 'public', 'views'];

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

var serie = function (arr, fn, callback) {
	var count = 0,
		limit = arr.length;

	var next = function () {
		if (count === limit) {
			return callback();
		}
		fn( arr[count++], next );
	};

	next();
};



var newCounter = function (limit, callback) {
	var cursor = 0,
		errors = [];

	return function (err) {
		if (err) {
			errors.push( err );
		}
		if (++cursor === limit) {
			if (errors.legth) {
				return callback( errors );
			}
			callback( callback );
		}
	};
};


var copyFolder = function (source, destination, callback) {
	ncp( source, destination, function (err) {
		if (err) {
			return callback( err );
		}
		callback();
	});
};


module.exports = function (dir, blockPaths, callback) {
	// - copy views, configs and public folders into /output/build
	deleteFolderRecursive( dir + '/output/build' );
	mkdirp( dir + '/output/build' );

	var copyBlock = function (blockPath, done) {
		var count = newCounter( groupFolders.length, done );
		groupFolders.forEach( function (folder) {
			copyFolder( blockPath + '/' + folder, dir + '/output/build/' + folder, count );
		});
	};

	serie( blockPaths, copyBlock, callback );
};
