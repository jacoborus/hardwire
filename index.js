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
	fs = require( 'fs' ),
	async = require('async'),
	http, https;

var objLength = function (obj) {
	var count = 0,
		i;

	for (i in obj) {
		count++;
	}
	return count;
};

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
var getPluginFolders = function () {
	var folders = getModuleFolders(),
		pPaths = {},
		f, pName;

	for (f in folders) {
		if (fs.existsSync( folders[f] + '/hw-plugin.json' )){
			pName = require( folders[f] + '/hw-plugin.json' ).name;
			if (pName) {
				pPaths[pName] = folders[f];
			}
		}
	}
	return pPaths;
};

var getPlugins = function (plugNames) {
	var plugins = {},
		pFolders = getPluginFolders(),
		i, j;
	for (i in plugNames) {
		for (j in pFolders) {
			if (j === plugNames[i] ) {
				plugins[j] = pFolders[j];
			}
		}
	}
	return plugins;
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
				}).exec( cb );
			} else {
				cb();
			}
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

		// Passports
		.folder( './app/sys/auth', {
			group : 'auth',
			suffix: 'Auth'
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
			if (!conf.ssl) {
				http = require('http');
				http.createServer( app ).listen( conf.port );
			} else {
				https = require('https');
				https.createServer( conf.sslCert, app ).listen( conf.port );
			}
			console.log( 'listening port ' + conf.port );
		});
	};


	conf = loadConfig( dir );
	conf.rootPath = dir;
	var hwConf = require( conf.rootPath + '/hw-conf.json');
	var plugins = getPlugins( hwConf.plugins );

	// build views and public files
	builder( plugins, dir );

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
	// core auth
	.folder( path.resolve( __dirname, 'sys/auth' ), {
		group: 'auth',
		suffix: 'Auth'
	})
	// core routes
	.folder( path.resolve( __dirname, 'routes' ), {
		group: 'router',
		suffix: 'Router'
	})

	.exec( function () {
		/* - LOAD PLUGINS - */
		var count = 0, i;

		if (objLength(plugins) > 0) {
			for (i in plugins) {
				async.parallel(
					[
						function (callback){
							loadFolder( plugins[i], 'models', 'models', 'Model', function () {
								callback(null, 'one');
							});
						},
						function (callback){
							loadFolder( plugins[i], 'controllers', 'control', 'Control', function () {
								callback(null, 'one');
							});
						},
						function (callback){
							loadFolder( plugins[i], 'sys/auth', 'auth', 'Auth', function () {
								callback(null, 'one');
							});
						},
						function (callback){
							loadFolder( plugins[i], 'routes', 'router', 'Router', function () {
								callback(null, 'one');
							});
						}
					],
					// optional callback
					function (err) {
						if (err) {throw err;}
						count++;
						if (count === objLength( plugins )) {
							loadApp();
						}
					}
				);
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
