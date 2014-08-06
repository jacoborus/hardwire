var fs = require('fs'),
	deepExtend = require('deep-extend'),
	path = require('path'),
	defConf = require('./default-config.json');

module.exports = function (dir) {
	var env = process.env.NODE_ENV || 'default',
		envConfig, configDir;

	configDir = path.resolve( dir, 'config/');
	var config = require( path.resolve( configDir,  'default.json' ));
	config = deepExtend( defConf, config );
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
