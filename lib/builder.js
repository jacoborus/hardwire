'use strict';

/* TODO: refactor this mess*/


var ncp = require('ncp').ncp,
	mkdirp = require('mkdirp'),
	fs = require('fs'),
	exec = require( 'child_process' ).exec;

ncp.limit = 16;

var deleteFolderRecursive = function (path, callback) {
	if (fs.existsSync( path )) {
		return exec( 'rm -r ' + path, callback );
	}
	callback();
};

var serie = function (arr, fn, callback) {
	var count = 0,
		limit = arr.length,
		next = function () {
			if (count === limit) {
				return callback();
			}
			fn( arr[count++], next );
		};
	next();
};


// generate a counter tick that fires `callback` when called `limit` times
var newCounter = function (limit, callback) {
	var cursor = 0,
		errors = [];
	return function (err) {
		if (err) { errors.push( err );}
		if (++cursor === limit) {
			if (errors.length) { return callback( errors );}
			callback( callback );
		}
	};
};

// copy all files in `source` to `destination`
var copyFolder = function (source, destination, callback) {
	ncp( source, destination, function (err) {
		if (err) {
			return callback( err );
		}
		callback();
	});
};

/*!
 * Recursive copy designed folders of every block in output folder
 *
 * Builder use this properties from Hardwire:
 *
 * - output
 * - buildFolders
 * - blockPaths
 *
 * @param  {Function} callback
 */
var builder = function (callback) {
	var self = this;
	// delete old build
	deleteFolderRecursive( this.output, function (err) {
		if (err) { return callback( err );}
		// create new output build folder
		mkdirp( self.output );
		// Copy folders in blockPath
		var copyBlock = function (blockPath, done) {
			var count = newCounter( self.buildFolders.length, done );
			self.buildFolders.forEach( function (folder) {
				copyFolder( blockPath + '/' + folder, self.output + '/' + folder, count );
			});
		};
		// copy every block in blockPaths
		serie( self.blockPaths, copyBlock, function (err) {
			console.log( 'Building complete');
			callback( err );
		});
	});
};

module.exports = builder;
