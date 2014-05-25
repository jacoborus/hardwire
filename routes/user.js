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

	return true;
};
