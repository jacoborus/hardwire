'use strict';

var fs = require('fs'),
	deepExtend = require('deep-extend'),
	path = require('path'),
	deepjson = require('deepjson');

module.exports = function (dir) {
	var env = process.env.NODE_ENV || 'default',
		configDir = path.resolve( dir, 'config'),
		hwConfPath = path.resolve( configDir, 'default.json'),
		config = deepjson( hwConfPath ),
		envConfig;

	config.folder = path.resolve( dir );

	if (env !== 'default') {
		if (fs.existsSync( path.resolve( configDir , env + '.json' ))) {
			envConfig = deepjson( path.resolve( configDir , env + '.json' ));
			config = deepExtend( config, envConfig );
		}
	}
	return config;
};
