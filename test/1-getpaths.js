'use strict';

var expect = require('chai').expect,
	getBlockPaths = require('../lib/paths.js');

describe( 'getBlockPaths', function () {
	var blockPaths = getBlockPaths(  __dirname + '/assets/paths', 'testengine' );

	it( 'get all paths of blocks in `/node_modules` and `app/blocks` with proper engine', function () {
		expect( blockPaths[0] ).to.equal( __dirname + '/assets/paths/node_modules/one' );
		expect( blockPaths[1] ).to.equal( __dirname + '/assets/paths/node_modules/two' );
		expect( blockPaths[2] ).to.equal( __dirname + '/assets/paths/app/blocks/b-one' );
		expect( blockPaths[3] ).to.equal( __dirname + '/assets/paths/app/blocks/b-two' );
	});
});