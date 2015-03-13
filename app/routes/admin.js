'use strict';

var reqAdmin = function (req, res, next) {
	if (req.session.profile && req.session.profile.rol === 'admin') {
		next();
	} else {
		res.redirect('/user/login');
	}
};

module.exports.wiretree = function (app, adminControl, models) {

	/*
	 * ADMIN    ----------------------------------------------------------------------
	 */
	app.route( '/admin' ).get( reqAdmin, adminControl.index );
	/* docs */
	app.route( '/admin/docs/:model' ).get( reqAdmin, adminControl.docs.search );
	app.route( '/admin/docs/:model/new' ).get( reqAdmin, adminControl.docs.new );
	app.route( '/admin/docs/:model' ).post( reqAdmin, adminControl.docs.create );
	app.route( '/admin/docs/:model/:id' ).get( reqAdmin, adminControl.docs.read );
	app.route( '/admin/docs/:model/:id/edit' ).get( reqAdmin, adminControl.docs.edit );
	app.route( '/admin/docs/:model/:id' ).put( reqAdmin, adminControl.docs.update );
	app.route( '/admin/docs/:model/:id' ).delete( reqAdmin, adminControl.docs.destroy );
	/*	 * keyval docs *	 */
	app.route( '/admin/keyval/:model/:id/edit' ).get( reqAdmin, adminControl.keyval.edit );
	app.route( '/admin/keyval/:model/:id' ).put( reqAdmin, adminControl.keyval.update );
	/* taxonomy */
	app.route( '/admin/taxonomy/:model' ).get( reqAdmin, adminControl.docs.taxonomy );

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
