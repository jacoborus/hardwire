'use strict';

var expect = require('chai').expect,
	getConfig = require('../lib/getConfig.js');

var hardwire = {
	config: {base:1},
	output: __dirname + '/assets/config/',
	environment: 'production',
	envProcessing: {
		TEST_ONE: 'testone',
		TEST_TWO: 'test.two'
	}
};

process.env.TEST_ONE = 1;
process.env.TEST_TWO = 2;

describe( 'getBlockPaths', function () {

	it( 'get all paths of blocks in `/node_modules` and `app/blocks` with proper engine', function (done) {
		getConfig.call( hardwire, function () {
			var config = hardwire.config;
			expect( config.default ).to.equal( true );
			expect( config.production ).to.equal( true );
			expect( config.base ).to.equal( 1 );
			expect( config.testone ).to.equal( '1' );
			expect( config.test.two ).to.equal( '2' );
			done();
		});
	});
});