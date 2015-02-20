'use strict';
var path = require('path'),
	ncp = require('ncp'),
	mkdirp = require('mkdirp'),
	cp = require('cp'),
	dir = path.resolve('.'),
	bFolder = path.resolve( __dirname, './boilerplate' );

mkdirp( dir + '/app/views');
mkdirp( dir + '/app/models');
mkdirp( dir + '/app/controllers');
mkdirp( dir + '/app/routes');
mkdirp( dir + '/app/public');
mkdirp( dir + '/config');

cp.sync(bFolder + '/app.js', dir + '/app.js' );
cp.sync(bFolder + '/README.md', dir + '/README.md' );
cp.sync( bFolder + '/default.json', dir + '/config/default.json');
cp.sync( bFolder + '/default.json', dir + '/config/production.json');
cp.sync( bFolder + '/gitignore', dir + '/.gitignore');


console.log('Basic boilerplate installed!');
