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





// Create framework
var hardwire = function (dir) {

	var tree = new Wiretree( dir ),
		conf;

	var loadFolder = function (plugName, folder, group, suffix, cb) {
		folder = './plugins/' + plugName + '/' + folder;
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

	var app = express();

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

	// build views and public files
	builder( conf );


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
			for (i in conf.plugins) {
				loadFolder( conf.plugins[i], 'models', 'models', 'Model', function () {
					loadFolder( conf.plugins[i], 'controllers', 'control', 'Control', function () {
						loadFolder( conf.plugins[i], 'routes', 'router', 'Router', function () {
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
