'use strict';

var fs = require('fs');

// get an array with block forder paths in `dir` folder
var getBlockFolders = function (dir, engine) {
	//get all folders in folder
	if (!fs.existsSync( dir )) {
		return [];
	}

	var folders = fs.readdirSync( dir ).map( function (fileName) {
		if (fs.statSync( dir + '/' + fileName ).isDirectory()) {
			return dir + '/' + fileName;
		}
	});

	if (!engine) {
		return folders;
	}

	var result = [];
	folders.forEach( function (folder) {
		var hwConf;
		if (fs.existsSync( folder + '/package.json' )){
			hwConf = require( folder + '/package.json' ).hardwire;
			if (hwConf && hwConf.engine === engine) {
				result.push( folder );
			}
		}
	});
	return result;
};


/**
 * Get an array with block folder paths
 *
 * **`options`:**
 *
 * - `condition` *Object|Function*: Condition for loading blocks in `/node_modules` that checks config object from `hardwire` field in package.json of every block.
 * It could be a validator function that gets this config object and returns a boolean. Or a object with params and values that has to match that object.
 * If no condition Hardwire won't search blocks in `/node_modules`
 * - `strict` *Boolean*: require condition in blocks stored in `/app/blocks`. Default: `false`
 *
 * Example with validator object:
 *
 * ```
 * getBlockPaths( '.', {
 *     condition: {
 *         engine: 'myEngineName'
 *     },
 *     strict: true
 * });
 *
 * ```
 *
 * Example with validator function:
 *
 * ```
 * getBlockPaths( '.', {
 *     validator: function (obj) {
 *         if (obj && obj.engine === 'myEngineName' && obj.version >=1) {
 *             return true;
 *         }
 *         return false;
 *     }
 * });
 * ```
 *
 * @param  {String} dir       resolved path to user application
 * @param  {Object} validator see below
 * @return {Array}           List of block folder paths
 */
var getBlockPaths = function (dir, engine) {
	var moduleBlocks = [],
		appBlocks = [];

	if (engine) {
		moduleBlocks = getBlockFolders( dir + '/node_modules', engine );
	}
	appBlocks = getBlockFolders( dir + '/app/blocks' );

	return moduleBlocks.concat( appBlocks );
};


module.exports = getBlockPaths;