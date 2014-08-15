'use strict';

var fs = require('fs'),
	deepExtend = require('deep-extend'),
	path = require('path'),
	defConf = require('./default-config.json');

module.exports = function (dir) {
	var env = process.env.NODE_ENV || 'default',
		configDir = path.resolve( dir, 'config'),
		hwConfPath = path.resolve( dir, 'hw-conf.json'),
		config = require( hwConfPath ),
		envConfig;

	config = deepExtend( defConf, config );
	config.folder = path.resolve( dir );

	if (env !== 'default') {
		if (fs.existsSync( path.resolve( configDir , env + '.json' ))) {
			envConfig = require( path.resolve( configDir , env + '.json' ));
			config = deepExtend( config, envConfig );
		}
	}
	return config;
};
