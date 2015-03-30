'use strict';
var path = require('path'),
	mkdirp = require('mkdirp'),
	ncp = require('ncp').ncp,
	fs = require('fs'),
	dir = path.resolve('.'),
	bFolder = path.resolve( __dirname, './boilerplate' );

ncp.limit = 16;

ncp( __dirname + '/boilerplate', dir, function (err) {
	if (err) { throw err;}
	fs.rename( dir + '/gitignore', dir + '/.gitignore', function (err) {
		if (err) { throw err;}
		else {console.log('Hardwire boilerplate installed!');}
	});
});
