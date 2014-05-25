'use strict';

/**
 * UniqueIDs
 * Return unique IDs
 * @return {String} unique hash
 * @api public
 */
var uniid = function () {
	var s4 = function () {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	};
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	 s4() + '-' + s4() + s4() + s4();
};

// Very custom async series function with array
var loopArray = function (fn, arr, callback) {
	var iterate, limit, cur;
	limit = arr.length - 1;
	// pointer
	cur = 0;

	iterate = function (err) {
		if (err) {
			return callback( err );
		} else {
			if (cur === limit) {
				callback();
			} else {
				cur++;
				fn( arr[cur], iterate );
			}
		}
	};
};

// Very custom async series function with object
var loopObject = function (fn, obj, callback) {

	var iterate, limit, cur, arr = [], i;

	limit = Object.keys( obj ).length;

	// pointer
	cur = 0;
	for (i in obj) {
		arr.push( i );
	}
	iterate = function (err) {
		if (err) {
			return callback( err );
		} else {
			if (cur === limit) {
				callback();
			} else {
				fn( obj[arr[cur]], iterate );
				cur++;
			}
		}
	};
	iterate();
};

module.exports = {
	uniid : uniid,
	loopArray: loopArray,
	loopObject: loopObject
};
