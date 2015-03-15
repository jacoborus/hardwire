'use strict';

var passport = require('passport');

exports.wiretree = function (config, UserModel ) {
	var User = UserModel;

	// serialize sessions
	passport.serializeUser( function (user, done) {
		done( null, user._id );
	});

	passport.deserializeUser( function (id, done) {
		User.findOne({ _id: id }, function (err, user) {
			done( err, user );
		});
	});


	// use local strategy
	var LocalStrategy = require('passport-local').Strategy;
	passport.use( new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		function (email, password, done) {

			User.findOne({ email: email }, function (err, user) {

				if (err) { return done(err); }
				if (!user || !user.authenticate(password)) {
					return done( null, false, {message: 'Invalid user or password'} );
				}
				return done(null, user);
			});
		}
	));

	return passport;
};
