'use strict';

// Forked from https://raw.githubusercontent.com/autoric/express-train/96adfe3675f6753dfa280f5e2ee34691c88c0d82/lib/app.js

// module dependencies

var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	pkg = require('./package.json'),
	deepExtend = require('deep-extend'),
	Wiretree = require('wiretree'),
	mongoose = require('mongoose');


var loadConfig = function (dir) {
	var env = process.env.NODE_ENV || 'default',
		envConfig, configDir;

	configDir =  path.resolve( dir, 'config/');
	var config = require( path.resolve( configDir,  'default.json' ));
	config.folder = dir;

	if (env !== 'default') {
		if (fs.existsSync( path.resolve( configDir , env + '.json' ))) {
			envConfig = require( path.resolve( configDir , env + '.json' ));
			return deepExtend(config, envConfig);
		} else {
			return config;
		}
	} else {
		return config;
	}
};


// Create framework
var subStuff = function (dir) {

	var tree = new Wiretree( __dirname );
	var app, conf;

	conf = loadConfig(dir);

	tree.add( conf, 'config' );

	//allow override of app
	app = express();
	tree.add( tree, 'tree' );
	tree.add( mongoose, 'mongoose');
	tree.add( app, 'app' );
	tree.add( express, 'express' );
//	tree.load( path.resolve( conf.folder, 'app/router/index.js' ), 'router' );
	tree.folder( path.resolve( __dirname, 'lib' ));

	// MODEL
	tree.folder( path.resolve( __dirname, 'models' ), {
		group : 'models'
	});

	tree.folder( './app/models', {
		group : 'models'
	});

	// CONTROLLER
	tree.folder( path.resolve( __dirname, 'controllers' ), {
		group: 'control'
	});

	tree.folder( './app/controllers', {
		group : 'control'
	});

	// ROUTER
	tree.folder( path.resolve( __dirname, 'routes' ), {
		group: 'router',
		suffix: 'Router'
	});

	tree.folder( './app/routes', {
		group: 'router',
		suffix: 'Router'
	});

	tree.get( 'dal' );
	tree.get( 'views' );
	tree.get( 'passp' );
	tree.get( 'middleware' );
	tree.get( 'router' );
	console.log('listening port 3000');
	app.listen(3000);
};


// expose framework version
subStuff.version = pkg.version;


// expose `subStuff()`
module.exports = subStuff;
