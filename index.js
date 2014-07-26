'use strict';

// Forked from https://raw.githubusercontent.com/autoric/express-train/96adfe3675f6753dfa280f5e2ee34691c88c0d82/lib/app.js

// module dependencies

var express = require('express'),
	path = require('path'),
	pkg = require('./package.json'),
	Wiretree = require('wiretree'),
	mongoose = require('mongoose'),
	loadConfig = require('./utils/loadConfig.js');


// Create framework
var hardwire = function (dir) {

	var tree = new Wiretree( __dirname );
	var app, conf;

	conf = loadConfig(dir);
	conf.rootPath = dir;

	tree.add( conf, 'config' );

	//allow override of app
	app = express();
	tree.add( tree, 'tree' );
	tree.add( mongoose, 'mongoose');
	tree.add( app, 'app' );
	tree.add( express, 'express' );
//	tree.load( path.resolve( conf.folder, 'app/router/index.js' ), 'router' );
	tree.folder( path.resolve( __dirname, 'lib' ));


	/* - LOAD CORE - */
	// Models
	tree.folder( path.resolve( __dirname, 'models' ), {
		group : 'models',
		suffix: 'Model'
	});

	// Controllers
	tree.folder( path.resolve( __dirname, 'controllers' ), {
		group: 'control',
		suffix: 'Control'
	});

	// Routes
	tree.folder( path.resolve( __dirname, 'routes' ), {
		group: 'router',
		suffix: 'Router'
	});


	/* - LOAD PLUGINS - */
	var plugin;
	if (conf.plugins) {

		// Models
		for (plugin in conf.plugins) {
			tree.folder( './app/' + plugin + '/models', {
				group : 'models',
				suffix: 'Model'
			});
		}

		// Controllers
		for (plugin in conf.plugins) {
			tree.folder( './app/' + plugin + '/controllers', {
				group : 'control',
				suffix: 'Control'
			});
		}

		// Routes
		for (plugin in conf.plugins) {
			tree.folder( './app/' + plugin + 'routes', {
				group: 'router',
				suffix: 'Router'
			});
		}
	}


	/* - LOAD APP - */
	// Models
	tree.folder( './app/models', {
		group : 'models',
		suffix: 'Model'
	});

	// Controllers
	tree.folder( './app/controllers', {
		group : 'control',
		suffix: 'Control'
	});

	// Routes
	tree.folder( './app/routes', {
		group: 'router',
		suffix: 'Router'
	});

	tree.get( 'dal' );
	tree.get( 'views' );
	tree.get( 'passp' );
	tree.get( 'middleware' );
	tree.get( 'router' );
	console.log( 'listening port ' + conf.port );
	app.listen( conf.port );
};


// expose CMS version
hardwire.version = pkg.version;


// expose `hardwire()`
module.exports = hardwire;
