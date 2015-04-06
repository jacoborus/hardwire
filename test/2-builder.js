'use strict';

var expect = require('chai').expect,
	util = require('util'),
	builder = require('../lib/builder.js'),
	fs = require('fs'),
	exec = require( 'child_process' ).exec;

var deleteFolderRecursive = function (path, callback) {
	if (fs.existsSync( path )) {
		return exec( 'rm -r ' + path, callback );
	}
	callback();
};

var hardwire = {
	output: __dirname + '/assets/builder/output',
	buildFolders: ['config', 'one', 'two'],
	blockPaths: [
		__dirname + '/assets/builder/a',
		__dirname + '/assets/builder/b'
	]
};

describe( 'Builder', function () {

	afterEach( function (done) {
	    deleteFolderRecursive( hardwire.output, done );
	});

	it( 'build blocks in order', function (done) {
		builder.call( hardwire, function (err) {
			expect( err ).to.not.exists;
			expect( fs.existsSync( __dirname + '/assets/builder/output/one/a.json' )).to.equal( true );
			expect( fs.existsSync( __dirname + '/assets/builder/output/one/b.json' )).to.equal( true );
			expect( fs.existsSync( __dirname + '/assets/builder/output/two/a.json' )).to.equal( true );
			expect( fs.existsSync( __dirname + '/assets/builder/output/two/b.json' )).to.equal( true );
			expect( require( __dirname + '/assets/builder/output/config/default.json' ).hello ).to.equal( 2 );
			done();
		});
	});

});