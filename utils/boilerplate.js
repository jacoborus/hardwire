'use strict';
var path = require( 'path' ),
	ncp = require( 'ncp' ),
	mkdirp = require( 'mkdirp' ),
	dir = path.resolve( '.' );


ncp( path.resolve( __dirname, './boilerplate' ), dir, function (err) {
	if (err) {
		console.error( err );
		process.exit( 1 );
	}
	mkdirp( dir + '/app/views');
	mkdirp( dir + '/app/models');
	mkdirp( dir + '/app/controllers');
	mkdirp( dir + '/app/routes');
	mkdirp( dir + '/app/public');
	console.log('Basic boilerplate installed!');
});
