'use strict';

var path = require('path'),
	deepjson = require('deepjson');

module.exports = function (dir) {
	var env = process.env.NODE_ENV || 'default',
		configDir = path.resolve( dir, 'config'),
		config;

	if (env === 'default') {
		config = deepjson( configDir + '/default' );
	} else {
		config = deepjson( configDir + '/default', configDir + '/' + env );
	}

	config.folder = path.resolve( dir );

	return config;
};
