'use strict';

var reqAdmin = function (req, res, next) {
	if (req.session.profile && req.session.profile.rol === 'admin') {
		next();
	} else {
		res.redirect('/user/login');
	}
};

module.exports.wiretree = function (app, express, models, control) {

	/*
	 * ADMIN    ----------------------------------------------------------------------
	 */
	app.route( '/admin' ).get( reqAdmin, control.admin.index );
	/* docs */
	app.route( '/admin/docs/:model' ).get( reqAdmin, control.admin.docs.search );
	app.route( '/admin/docs/:model/new' ).get( reqAdmin, control.admin.docs.new );
	app.route( '/admin/docs/:model' ).post( reqAdmin, control.admin.docs.create );
	app.route( '/admin/docs/:model/:id' ).get( reqAdmin, control.admin.docs.read );
	app.route( '/admin/docs/:model/:id/edit' ).get( reqAdmin, control.admin.docs.edit );
	app.route( '/admin/docs/:model/:id' ).put( reqAdmin, control.admin.docs.update );
	app.route( '/admin/docs/:model/:id' ).delete( reqAdmin, control.admin.docs.destroy );
	/*	 * keyval docs *	 */
	app.route( '/admin/keyval/:model/:id/edit' ).get( reqAdmin, control.admin.keyval.edit );
	app.route( '/admin/keyval/:model/:id' ).put( reqAdmin, control.admin.keyval.update );
	/* taxonomy */
	app.route( '/admin/taxonomy/:model' ).get( reqAdmin, control.admin.docs.taxonomy );

	/*
	 * APP PARAMS    ---------------------------------------------
	 */

	app.param( 'model', function (req, res, next, model) {
		var Model = models[model];
		if (Model === undefined) {
			console.log( 'Error: undefined model' );
			return res.send(404);
		}
		req.Model = Model;
		req.modelName = model;
		return next();
	});

	return true;
};
