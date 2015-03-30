'use strict';

var deepjson = require('deepjson');

module.exports = function (dir) {
	var env = process.env.NODE_ENV || 'default',
		coreCfg = require( __dirname + '/../app/config/default.json' ),
		config;

	if (env === 'default') {
		config = deepjson( coreCfg, dir + '/default' );
	} else {
		config = deepjson( coreCfg, dir + '/default', dir + '/' + env );
	}

	config.folder = dir;
	if (process.env.MONGODB_URI) {
		config.mongodb.uri = process.env.MONGODB_URI;
	}
	if (process.env.MONGODB_USER) {
		config.mongodb.user = process.env.MONGODB_USER;
	}
	if (process.env.MONGODB_PASS) {
		config.mongodb.pass = process.env.MONGODB_PASS;
	}

	return config;
};
