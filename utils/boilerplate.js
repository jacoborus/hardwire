'use strict';
var path = require('path'),
	ncp = require('ncp'),
	mkdirp = require('mkdirp'),
	cp = require('cp'),
	dir = path.resolve('.'),
	bFolder = path.resolve( __dirname, './boilerplate' ),
	files = ['app.js', 'hw-conf.json', 'README.md'];

files.forEach( function (file) {
	cp.sync(bFolder + '/' + file, dir + '/' + file);
});
cp.sync(bFolder + '/gitignore', dir + '/.gitignore');

mkdirp( dir + '/app/views');
mkdirp( dir + '/app/models');
mkdirp( dir + '/app/controllers');
mkdirp( dir + '/app/routes');
mkdirp( dir + '/app/public');

console.log('Basic boilerplate installed!');
