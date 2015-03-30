'use strict';

var fs = require('fs');

// get an array with block forder paths in `dir` folder
var getBlockFolders = function (dir) {
	var folders = [],
		blocks = [];
	//get all folders in folder
	if (fs.existsSync( dir )) {
		fs.readdirSync( dir )
		.forEach( function (fileName) {
			if (fs.statSync( dir + '/' + fileName ).isDirectory()) {
				folders.push( dir + '/' + fileName );
			}
		});
		// add blocks folders to blocks
		folders.forEach( function (folder) {
			var hwConf;
			if (fs.existsSync( folder + '/package.json' )){
				hwConf = require( folder + '/package.json' ).hardwire;
				if (hwConf && hwConf.name) {
					blocks.push( folder );
				}
			}
		});
	}
	return blocks;
};


// return an array with block folder paths
module.exports = function (dir) {
	var moduleBlocks = getBlockFolders( dir + '/node_modules' ),
		appBlocks = getBlockFolders( dir + '/app/blocks' );

	return moduleBlocks.concat( appBlocks );
};
