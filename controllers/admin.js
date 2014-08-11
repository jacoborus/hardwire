'use strict';

var deepExt, fs, limpia;

fs = require('fs');



deepExt = function(ori, desti) {
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

limpia = function(query) {
	var prop, val;
	for (prop in query) {
		val = query[prop];
		if (val === '') {
			delete query[prop];
		}
	}
	return query;
};

exports.wiretree = function (app, log, models, crudsControl) {
	var cruds = crudsControl;
	return {
		index: function(req, res) {
			return res.render('admin/index', {
				title: 'Dashboard',
				req: req
			});
		},

		/*
		 * APP DOCS    ---------------------------------------------------------------
		 */
		docs: {
			search: function(req, res, next) {
				var query;
				query = limpia(req.query);
				req.Model.find( query, function (err, data) {
					if (err) {
						return next(err);
					}
					res.render('admin/docs/' + req.Model.modelName + '/list', {
						title: 'Listado de ' + req.Model.modelName + 's',
						data: data
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
						id: data.id
					});
				});
			},

			read: function (req, res) {
				var modelName = req.Model.modelName;
				cruds.read( modelName, req.params.id, function (err, data) {
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
						id: data.id
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

			new: function(req, res, next) {
				var modelName = req.Model.modelName;
				return res.render('admin/docs/' + modelName + '/new', {
					title: 'Crear ' + modelName,
					data: req.body
				});
			},

			edit: function(req, res) {
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
						title: 'Edit ' + modelName + " " + req.params.id,
						data: data
					});
				});
			}
		},
		/*
		 * KEYVAL DOCS    ---------------------------------------------------------------
		 */
		keyval: {

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
						id: data.id
					});
				});
			},

			edit: function(req, res) {
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
						title: 'Edit ' + modelName + " " + req.params.id,
						data: data
					});
				});
			}
		}
	};
};

