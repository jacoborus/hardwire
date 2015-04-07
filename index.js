'use strict';

var Wiretree = require('wiretree'),
	getBlockPaths = require('./lib/paths.js'),
	getConfig = require('./lib/getConfig.js'),
	builder = require('./lib/builder.js'),
	path = require('path'),
	fs = require('fs');


var serie = function (target, functions, callback) {
	var fns = functions.slice();
	callback = callback || function (err) {
		if (err) { throw err;}
	};
	var next = function (err) {
		if (err) { return callback.call( target, err );}
		if (!fns.length) {
			return callback.call( target );
		}
		fns.shift().call( target, next );
	};
	next();
};


// generate a counter tick that fires `callback` when called `limit` times
var newCounter = function (limit, callback) {
	var cursor = 0,
		errors = [];
	return function (err) {
		if (err) { errors.push( err );}
		if (++cursor >= limit) {
			if (errors.length) { return callback( errors );}
			callback();
		}
	};
};


var Hardwire = function (options, resolve) {
	options = options || {};
	this.engine = options.engine || false;
	if (!this.engine) {
		throw new Error('Engine name required');
	}
	this.folder = path.resolve( options.folder || '.');
	this.output = path.resolve( options.folder, options.output || 'build' );
	this.buildFolders = ['config'].concat( options.buildFolders || []);
	this.config = options.config || {};
	this.environment = options.environment || process.env.NODE_ENV !== 'default' ? process.env.NODE_ENV : false;
	this.envProcessing = options.envProcessing || {};
	this.tree = new Wiretree( this.folder );
	// build stuff
	if (options.beforeBuild) {
		this.beforeBuild = options.beforeBuild;
	}
	if (options.afterBuild) {
		this.afterBuild = options.afterBuild;
	}
	// config stuff
	if (options.beforeConfig) {
		this.beforeConfig = options.beforeConfig;
	}
	if (options.afterConfig) {
		this.afterConfig = options.afterConfig;
	}
	// loading stuff
	if (options.beforeLoad) {
		this.beforeLoad = options.beforeLoad;
	}
	if (options.load) {
		this.load = options.load;
	}
	if (options.afterLoad) {
		this.afterLoad = options.afterLoad;
	}
	// loading stuff
	if (options.afterAll) {
		this.afterAll = options.afterAll;
	}
	// load environment variables from .env file
	if (fs.existsSync( this.folder + '/.env' )) {
		require('dotenv').config({ path: this.folder + '/.env' }).load();
	}
	if (resolve) {
		this.resolve();
	}
};

// Build middleware
Hardwire.prototype.beforeBuild = function (next) {
	next();
};
Hardwire.prototype.builder = builder;
Hardwire.prototype.afterBuild = function (next) {
	next();
};


// Config middleware
Hardwire.prototype.beforeConfig = function (next) {
	next();
};
Hardwire.prototype.getConfig = getConfig;
Hardwire.prototype.afterConfig = function (next) {
	next();
};


// Load middleware
Hardwire.prototype.beforeLoad = function  (next) {
	next();
};
Hardwire.prototype.load = function (blockPath, next) {
	next();
};
Hardwire.prototype.loadBlocks = function (next) {
	var self = this,
		count = newCounter( this.blockPaths.length, next );
	this.blockPaths.forEach( function (blockPath) {
		self.load( blockPath, count );
	});
};
Hardwire.prototype.afterLoad = function (next) {
	next();
};

Hardwire.prototype.resolve = function () {
	var self = this;
	this.blockPaths = [ this.folder + '/node_modules/' + this.engine + '/core' ]
		.concat( getBlockPaths( this.folder, this.engine ))
		.concat( this.folder + '/app');
	serie( this, [
		this.beforeBuild,
		this.builder,
		this.afterBuild,
		this.beforeConfig,
		this.getConfig,
		this.afterConfig,
		function (next) {
			self.tree
			.add( 'config', self.config )
			.then( next );
		},
		this.beforeLoad,
		this.loadBlocks,
		this.afterLoad
	], function (err) {
		if (err) { return self.afterAll( err );}
		self.tree.resolve( function (err) {
			self.afterAll( err );
		});
	});
};


// After all
Hardwire.prototype.afterAll = function (err) {
	if (err) { throw err;}
};

module.exports = Hardwire;
