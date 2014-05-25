'use strict';

var fs = require('fs');


var cleanQuery = function (query) {
	var prop, val;
	for (prop in query) {
		val = query[prop];
		if (val === '') {
			delete query[prop];
		}
	}
	return query;
};

exports.wiretree = function (log, models, storeFiles) {

	var mod = {};

	mod.create = function (modelName, body,	files, callback) {

		var doc = new models[ modelName ]( body );

		doc.validate( function (errValidate) {
			if (errValidate) {
				callback( errValidate );
			} else {
				storeFiles.add( modelName, files, doc, function (errStore) {
					if ( errStore ) {
						callback( errStore );
					} else {
						doc.save( function (err, data) {
							if (err) {
								callback( err );
							} else {
								callback( null, data );
							}
						});
					}
				});
			}
		});
	};

	mod.read = function (modelName, id, callback) {
		models[modelName].findById( id, function (err, data) {
			if (err) { callback( err );}
			callback( null, data );
		});
	};

	mod.update = function (id, modelName, body,	files, callback) {
		var i;
		models[ modelName ].findById( id, function (err, doc) {
			for (i in body) {
				doc[i] = body[i];
				doc.validate( function (errValidate) {
					if (errValidate) {
						callback( errValidate );
					} else {
						storeFiles.add( modelName, files, doc, function (errStore) {
							if ( errStore ) {
								callback( errStore );
							} else {
								doc.save( function (err, data) {
									if (err) {
										callback( err );
									} else {
										callback( null, data );
									}
								});
							}
						});
					}
				});
			}
		});
	};

	mod.destroy = function (id, modelName, callback) {
		models[modelName].findByIdAndRemove( id, callback);
	};

	mod.search = function (req, res, next) {
		var query;
		query = cleanQuery(req.query);
		return req.Model.find(query, function(err, data) {
			if (err) {
				return next(err);
			}
			return res.render('admin/docs/' + req.Model.modelName + '/list', {
				title: 'Listado de ' + req.Model.modelName + 's',
				data: data
			});
		});
	};

	return mod;
};

