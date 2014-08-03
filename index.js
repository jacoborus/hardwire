'use strict';

// Forked from https://raw.githubusercontent.com/autoric/express-train/96adfe3675f6753dfa280f5e2ee34691c88c0d82/lib/app.js

// module dependencies

var express = require('express'),
	path = require('path'),
	pkg = require('./package.json'),
	Wiretree = require('wiretree'),
	mongoose = require('mongoose'),
	loadConfig = require('./utils/loadConfig.js'),
	builder = require( './utils/builder.js' ),
	fs = require( 'fs' );


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



// Create framework
var hardwire = function (dir) {

	var tree = new Wiretree( dir ),
		conf;

	var loadFolder = function (plugPath, folder, group, suffix, cb) {
		folder = plugPath + '/' + folder;
		fs.exists( folder, function (exists) {
			if (exists && fs.lstatSync( folder ).isDirectory()) {
				tree.folder( folder, {
					group : group,
					suffix: suffix
				});
			}
			cb();
		});
	};



	var loadApp = function () {
		/* - LOAD APP - */
		// Models
		tree.folder( './app/models', {
			group : 'models',
			suffix: 'Model'
		})

		// Controllers
		.folder( './app/controllers', {
			group : 'control',
			suffix: 'Control'
		})

		// Routes
		.folder( './app/routes', {
			group: 'router',
			suffix: 'Router'
		}).exec( function () {

			tree.get( 'dal' );
			tree.get( 'views' );
			tree.get( 'passp' );
			tree.get( 'middleware' );
			tree.get( 'router' );
			console.log( 'listening port ' + conf.port );
			app.listen( conf.port );
		});
	};

	conf = loadConfig( dir );
	conf.rootPath = dir;
	var pFolders = getPluginFolders( conf.plugins );

	// build views and public files
	builder( conf );

	var app = express();

	tree
	.add( conf, 'config' )
	.add( tree, 'tree' )
	.add( mongoose, 'mongoose')
	.add( app, 'app' )
	.add( express, 'express' )
	.folder( path.resolve( __dirname, 'lib' ))
	// core models
	.folder( path.resolve( __dirname, 'models' ), {
		group : 'models',
		suffix: 'Model'
	})
	// core controllers
	.folder( path.resolve( __dirname, 'controllers' ), {
		group: 'control',
		suffix: 'Control'
	})
	// core routes
	.folder( path.resolve( __dirname, 'routes' ), {
		group: 'router',
		suffix: 'Router'
	})

	.exec( function () {
		/* - LOAD PLUGINS - */
		var i, count = 0;
		if (conf.plugins) {
			for (i in pFolders) {
				loadFolder( pFolders[i], 'models', 'models', 'Model', function () {
					loadFolder( pFolders[i], 'controllers', 'control', 'Control', function () {
						loadFolder( pFolders[i], 'routes', 'router', 'Router', function () {
							count++;
							if (count === conf.plugins.length) {
								loadApp();
							}
						});
					});
				});
			}
		} else {
			loadApp();
		}
	});
};


// expose CMS version
hardwire.version = pkg.version;


// expose `hardwire()`
module.exports = hardwire;
