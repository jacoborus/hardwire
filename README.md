Hardwire
========

**Work in progress**

Structured and scalable node.js app container

(if you are looking for the CMS check [JetKit](https://github.com/jacoborus/jetkit))


Features
--------

- Scalable architecture structured in blocks and plugins
- Tree based dependency container
- Build system
- Boilerplate generator
- Environment oriented configurations loader
- Add .env file content to environment variables
- Environment variables processor


Instructions
------------

Coming soon


Express - MongoDB example
-------------------------

```js
var Hardwire = require('hardwire'),
	express = require('express'),
	mongoose = require('mongoose');

var hardwire = new Hardwire({
	output: 'output/build',

	// folders to build in every block
	buildFolders: ['public', 'views'],

	// default config
	config: {port: 3000},

	// force load production environment
	environment: 'production',

	// rules for adding environment variables into config
	envProcessing: {
		// this will set MONGO_URI value from environment variables
		// into mongodb.uri property of config
		MONGO_URI: 'mongodb.uri'
	},

	// to do before build blocks
	beforeBuild: function (next) {
		// this.config ....
		next();
	},

	// to do after build blocks
	afterBuild: function (next) {
		next();
	},

	// work  with config before load config
	beforeConfig: function (next) {
		// this.config ....
		next();
	},

	// work with config after load config
	afterConfig: function (next) {
		next();
	},

	// work  with tree before load tree
	beforeLoad: function (next) {
		this.tree
		.add( 'express', express )
		.add( 'app', express( ))
		.add( 'mongoose', mongoose )
		.then( next );
	},

	// rules for load every block
	load: function (blockPath, next) {
		this.tree
		.folder( blockPath + '/lib', {
			hidden: true
		})
		.folder( blockPath + '/models', {
			group : 'models',
			suffix: 'Model'
		})
		.folder( blockPath + '/controllers', {
			group : 'control',
			suffix: 'Ctrl'
		})
		.folder( blockPath + '/routes', {
			group: 'router',
			suffix: 'Router'
		})
		.then( function () {
			next();
		});
	},

	// work with tree after load tree
	afterLoad: function (next) {
		next();
	},

	// to do after resolve tree
	// afterAll catch all middleware errors
	afterAll: function (err) {
		if (err) { throw err;}
		var app = this.tree.get( 'app' ),
			http = require('http');
		http.createServer( app ).listen( this.config.port );
		console.log( 'listening port ' + this.config.port );
	}

});

// resolve framework
hardwire.resolve();
```


<br><br>

---

© 2015 Jacobo Tabernero - [jacoborus](http://jacoborus.codes)

Released under [MIT License](https://raw.github.com/jacoborus/hardwire/master/LICENSE)
