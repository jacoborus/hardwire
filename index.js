'use strict';

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

// get an array with /node_module folder paths
var getModuleFolders = function () {
	var folders = [],
		nmPath = path.resolve('./node_modules');

	if (fs.existsSync( nmPath)) {
		fs.readdirSync( nmPath )
		.forEach( function (fileName) {
			if (fs.statSync( nmPath + '/' + fileName ).isDirectory()) {
				folders.push( nmPath + '/' + fileName );
			}
		});
	}
	return folders;
};


// get plugin folders
var getPluginFolders = function () {
	var folders = getModuleFolders(),
		pPaths = {};

	folders.forEach( function (folder) {
		var pName;
		if (fs.existsSync( folder + '/hw-plugin.json' )){
			pName = require( folder + '/hw-plugin.json' ).name;
			if (pName) {
				pPaths[pName] = folder;
			}
		}
	});
	return pPaths;
};

var getPlugins = function (plugNames) {
	var plugins = {},
		pFolders = getPluginFolders(),
		i;
	plugNames.forEach( function (name) {
		for (i in pFolders) {
			if (i === name ) {
				plugins[i] = pFolders[i];
			}
		}
	});
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
				}).then( cb );
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
		})
		.resolve( function () {
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
	var hwConf = require( conf.rootPath + '/config/default.json');
	var plugins = getPlugins( hwConf.plugins );

	// build views and public files
	builder( plugins, dir );

	var app = express();

	tree
	.add( 'config', conf )
	.add( 'tree', tree )
	.add( 'mongoose', mongoose )
	.add( 'app', app )
	.add( 'express', express )
	.folder( path.resolve( __dirname, 'app', 'lib' ))
	// core models
	.folder( path.resolve( __dirname, 'app', 'models' ), {
		group : 'models',
		suffix: 'Model'
	})
	// core controllers
	.folder( path.resolve( __dirname, 'app', 'controllers' ), {
		group: 'control',
		suffix: 'Control'
	})
	// core auth
	.folder( path.resolve( __dirname, 'app', 'sys/auth' ), {
		group: 'auth',
		suffix: 'Auth'
	})
	// core routes
	.folder( path.resolve( __dirname, 'app', 'routes' ), {
		group: 'router',
		suffix: 'Router'
	})

	.then( function () {
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

