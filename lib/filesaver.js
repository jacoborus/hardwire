'use strict';

var Filesaver = require( 'filesaver' ),
	mkdirp = require('mkdirp'),
	path = require('path');

exports.wiretree = function (config) {
	// create temp folder if not exists
	mkdirp( path.resolve( config.folder, config.tempFolder ), function (err) {
		if (err) { throw( err ); }
	});
	return new Filesaver({ folders: config.uploadFolders, safenames: true });
};
