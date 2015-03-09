'use strict';

var fs = require('fs');

var deepExt = function(ori, desti) {
	var key, val;
	for (key in ori) {
		val = ori[key];
		if ((val === null) || (typeof val !== 'object')) {
			desti[key] = val;
		} else {
			if (!desti[key]) {
				desti[key] = {};
			}
			deepExt(desti[key], val);
		}
	}
	return desti;
};

var limpia = function(query) {
	var prop, val;
	for (prop in query) {
		val = query[prop];
		if (val === '') {
			delete query[prop];
		}
	}
	return query;
};

exports.wiretree = function (app, log, models, crudsControl, populateControl) {
	var cruds = crudsControl;
	var popu = populateControl;
	return {
		index: function (req, res) {
			return res.render('admin/index', {
				title: 'Dashboard',
				req: req
			});
		},

		/*
		 * APP DOCS    ---------------------------------------------------------------
		 */
		docs: {

			search: function (req, res, next) {
				var modelName = req.Model.modelName,
					po = popu( modelName, 'search' );

				cruds.search( modelName, req.query, {population: po}, function (err, data) {
					if (err) { return next( err ); }

					res.render( 'admin/docs/' + modelName + '/list', {
						title: modelName + 's',
						data: data || []
					});
				});
			},

			create: function (req, res, next) {
				cruds.create( req.Model.modelName, req.body, req.files, function (err, data) {
					if (err) {
						console.log( err );
						return res.json({
							ok: false
						});
					}
					res.json({
						ok: true,
						id: data.id,
						model: req.Model.modelName
					});
				});
			},

			read: function (req, res) {
				var modelName = req.Model.modelName;
				var po = popu( modelName, 'read' );
				cruds.read( modelName, req.params.id, {population: po}, function (err, data) {
					if (err) {
						console.log( err );
						return res.send( 500 );
					}
					if (data === null) {
						return res.send( 404 );
					}
					res.render( 'admin/docs/' + modelName + '/show', {
						title: 'Doc : ' + data.id,
						data: data
					});
				});
			},

			update: function (req, res, next) {

				cruds.update( req.params.id, req.Model.modelName, req.body, req.files, function (err, data) {
					if (err) {
						console.log( err );
						return res.json({
							ok: false
						});
					}
					res.json({
						ok: true,
						id: data.id,
						model: req.Model.modelName
					});
				});
			},


			destroy: function (req, res, next) {
				var modelName = req.Model.modelName;
				cruds.destroy( req.params.id, modelName, function (err, data) {
					if (err) {
						return next(err);
					}
					if (data === null) {
						return res.json({ res: false });
					}
					res.json({
						res: true
					});
				});
			},

			new: function (req, res, next) {
				var modelName = req.Model.modelName;
				return res.render('admin/docs/' + modelName + '/new', {
					title: 'Crear ' + modelName,
					data: req.body
				});
			},

			edit: function (req, res) {
				var modelName = req.Model.modelName;
				var po = popu( modelName, 'edit' );
				cruds.read( modelName, req.params.id, {population: po}, function (err, data) {
					if (err) {
						console.log( err );
						return res.send( 500 );
					}
					if (data === null) {
						return res.send( 404 );
					}
					res.render('admin/docs/' + modelName + '/edit', {
						title: 'Edit ' + modelName + ' ' + req.params.id,
						data: data
					});
				});
			},

			taxonomy: function (req, res, next) {
				cruds.search( req.modelName, {}, {}, function (err, data) {
					if (err) { return next( err );}
					res.json({
						ok: true,
						data: data
					});
				});
			}
		},
		/*
		 * KEYVAL DOCS    ---------------------------------------------------------------
		 */
		keyval: {

			update: function (req, res) {

				cruds.update( req.params.id, req.Model.modelName, req.body, req.files, function (err, data) {
					if (err) {
						console.log( err );
						return res.json({
							ok: false
						});
					}
					res.json({
						ok: true,
						id: data.id
					});
				});
			},

			edit: function (req, res) {
				var modelName = req.Model.modelName;
				cruds.read( modelName, req.params.id, function (err, data) {
					if (err) {
						console.log( err );
						return res.send( 500 );
					}
					if (data === null) {
						return res.send( 404 );
					}
					res.render('admin/docs/' + modelName + '/edit', {
						title: 'Edit ' + modelName + ' ' + req.params.id,
						data: data
					});
				});
			}
		}
	};
};

