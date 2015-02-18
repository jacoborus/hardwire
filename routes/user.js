'use strict';

var passport;

passport = require('passport');


module.exports.wiretree = function (app, control) {

	/*
	 * USER     ----------------------------------------------------------
	 */
	app.route('/user/login').get( control.main.login );
	app.route('/user/logout').get( control.user.logout );
	app.route('/user/login').post( passport.authenticate( 'local', {
		failureRedirect: '/user/login',
		failureFlash: 'Invalid email or password.'
	}), control.user.session );

	app.route('/user/forgot-password').get( control.user.forgotPasswordGet );
	app.route('/user/forgot-password').post( control.user.forgotPasswordPost );
	app.route('/user/forgot-error').get( control.user.forgotPasswordError );
	app.route('/user/restore/:hash').get( control.user.restorePasswordGet );
	app.route('/user/restore/:hash').post( control.user.restorePasswordPost );
	app.route('/user/password-restored').get( control.user.restoreSuccess );
	return true;
};
