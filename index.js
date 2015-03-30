'use strict';

// module dependencies
var express = require('express'),
	pkg = require('./package.json'),
	Wiretree = require('wiretree'),
	mongoose = require('mongoose'),
	loadConfig = require('./utils/loadConfig.js'),
	getBlockPaths = require('./utils/block_paths.js'),
	builder = require( './utils/builder.js' ),
	fs = require( 'fs' ),
	SingleDoc = require( __dirname + '/app/utilities/SingleDoc.js'),
	safename = require('safename'),
	path = require('path'),
	http, https;

var resolvePaths = function (paths, dir, config) {
	paths.forEach( function (p) {
		config[p] = path.resolve( dir, config[p] );
	});
};

var processCollection = function (schema, settings) {
	if (settings._taxoInfo) {
		schema
		.virtual( '_taxoInfo' )
		.get( settings._taxoInfo );
	}
	return mongoose.model( settings.modelName, schema, settings.collection );
};

var processSingle = function (val, settings) {
	return new SingleDoc( settings.modelName, val );
};

var loadBlock = function (tree, blockPath, next) {
	/* - LOAD APP - */
	// libs
	tree.folder( blockPath + '/lib', {
		hidden: true
	})
	// Models
	.folder( blockPath + '/models', {
		group : 'models',
		suffix: 'Model'
	})
	.folder( blockPath + '/models/collections', {
		group : 'models',
		suffix: 'Model',
		processing: processCollection
	})
	.folder( blockPath + '/models/singles', {
		group : 'models',
		suffix: 'Model',
		processing: processSingle
	})

	// Controllers
	.folder( blockPath + '/controllers', {
		group : 'control',
		suffix: 'Control'
	})

	// Services
	.folder( blockPath + '/services', {
		group : 'services',
		suffix: 'Srv'
	})

	// Utilities
	.folder( blockPath + '/utilities', {
		group : 'utilities',
		suffix: 'Util'
	})

	// File buckets
	.folder( blockPath + '/buckets', {
		group : 'buckets',
		suffix: 'Bucket'
	})

	// Passports
	.folder( blockPath + '/sys/auth', {
		group : 'auth',
		suffix: 'Auth'
	})

	// Routes
	.folder( blockPath + '/routes', {
		group: 'router',
		suffix: 'Router'
	})
	.then( next );
};

var serie = function (tree, blockPaths, callback) {
	var cursor = 0,
		limit = blockPaths.length;

	var next = function (self) {
		if (cursor === limit) {
			return callback();
		}
		loadBlock( tree, blockPaths[cursor++], next );
	};
	next();
};


var loadAppProvider = function (dir, blockPaths) {
	return function () {
		console.log( 'Loading tree');
		var tree = new Wiretree( dir ),
			app = express(),
			conf = loadConfig( dir + '/output/build/config' );

		conf.rootPath = dir;
		resolvePaths( ['rootPath', 'buildFolder', 'tempFolder', 'logPath'], dir, conf );
		conf.buckets = conf.buckets || {};

		tree
		.add( 'config', conf )
		.add( 'express', express )
		.add( 'app', app )
		.add( 'mongoose', mongoose )
		.add( 'safename', safename, {
			group: 'utilities',
			localname: 'safename'
		})
		.then( function () {
			serie( tree, blockPaths, function (err) {
				tree.resolve( function (err) {
					if (err) { throw err;}
					console.log( 'Tree loaded');
					if (!conf.ssl) {
						http = require('http');
						http.createServer( app ).listen( conf.port );
					} else {
						https = require('https');
						https.createServer( conf.sslCert, app ).listen( conf.port );
					}
					console.log( 'listening port ' + conf.port );
				});
			});
		});
	};
};


// Create framework
var hardwire = function (dir) {
	// load environment variables from .env file
	if (fs.existsSync( dir + '/.env' )) {
		require('dotenv').config({path: dir + '/.env'}).load();
	}
	var blockPaths = getBlockPaths( dir ),
		corePath = __dirname + '/app';

	blockPaths = [corePath].concat( blockPaths ).concat( dir + '/app' );
	// build views, configs and public files
	builder( dir, blockPaths, loadAppProvider( dir, blockPaths ));
};


// expose CMS version
hardwire.version = pkg.version;


// expose `hardwire()`
module.exports = hardwire;

