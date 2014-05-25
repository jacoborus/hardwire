'use strict';

exports.wiretree = function (filesaver, tools) {

	var loopObject = tools.loopObject;

	var addFn = function (folder, doc) {
		return function (file, next) {
			filesaver.add( folder, file.path, file.name, function (err, datafile) {
				if (err) { next( err );}
				else {
					doc[file.fieldname] = datafile.filename;
					next();
				}
			});
		};
	};

	var mod = {};


	mod.add = function (folder, files, doc, callback) {
		var fn = addFn( folder, doc );
		loopObject( fn, files, callback );
	};

	return mod;

};
