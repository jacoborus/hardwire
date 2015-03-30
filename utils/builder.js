'use strict';

/* TODO: refactor this mess*/


var ncp = require('ncp').ncp,
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	exec = require( 'child_process' ).exec;

ncp.limit = 16;

var groupFolders = ['config', 'public', 'views'];

var deleteFolderRecursive = function (path, callback) {
	exec( 'rm -r ' + path, callback );
};

var serie = function (arr, fn, callback) {
	var count = 0,
		limit = arr.length;

	var next = function () {
		if (count === limit) {
			console.log( 'Build complete');
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
	console.log( 'Building...');
	// - copy views, configs and public folders into /output/build
	deleteFolderRecursive( dir + '/output/build', function (err) {
		mkdirp( dir + '/output/build' );

		var copyBlock = function (blockPath, done) {
			var count = newCounter( groupFolders.length, done );
			groupFolders.forEach( function (folder) {
				copyFolder( blockPath + '/' + folder, dir + '/output/build/' + folder, count );
			});
		};

		serie( blockPaths, copyBlock, callback );
	});
};
