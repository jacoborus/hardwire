'use strict';

var deepjson = require('deepjson');


/*!
 * Add environment variables to destination object
 * @param  {Onject}   destination objet to put values
 * @param  {Object}   paths       dictionary with environment variable keys as keys and dot notation paths as values
 * @return {Object}               extended destination object
 */
var envProcedure = function (destination, paths, callback) {
	var rules = [],
		env = process.env,
		i;

	// generate rules from paths and environment variables
	for (i in paths) {
		rules[i] = [ paths[i], env[i] ];
	}

	// process destination with every rule
	rules.forEach( function (rule) {
		var track = rule[0].trim().split('.'),
			prev = destination;
		track.forEach( function (step, i) {
			if (typeof track[i+1] !== 'undefined') {
				if (typeof prev[step] !== 'object' || prev[step].length !== 'undefined' || prev[step] === null) {
					prev[step] = {};
				}
				return (prev = prev[step]);
			}
			prev[step] = rule[1];
		});
	});
	callback();
};

module.exports = function (callback) {
	this.config = deepjson(
		this.config,
		this.output + '/config/default',
		this.environment ? this.output + '/config/' + this.environment : {}
	);
	envProcedure( this.config, this.envProcessing, callback );
};
