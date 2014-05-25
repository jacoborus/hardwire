
var passport = require('passport');



exports.wiretree = function ( config, User ) {

	if (config.passports.local) {
		var LocalStrategy = require('passport-local').Strategy;
	}
	if (config.passports.facebook) {
		var FacebookStrategy = require('passport-facebook').Strategy;
	}

	// serialize sessions
	passport.serializeUser( function (user, done) {
		done( null, user._id );
	});

	passport.deserializeUser( function (id, done) {
		User.findOne( { _id: id }, function (err, user) {
			done( err, user );
		});
	});


	// Load Local Strategy
	if (config.passports.local) {
		// use local strategy
		passport.use(new LocalStrategy({
				usernameField: 'email',
				passwordField: 'password'
			},
			function(email, password, done) {

				User.findOne({ email: email}, function (err, user) {

					if (err) { return done(err) }
					if (!user) {
						return done(null, false, { message: 'Unknown user' })
					}
					if (user.authenticate) {
						// mongoStore connection
						if (!user.authenticate(password)) {
							return done(null, false, { message: 'Invalid password' })
						}
					} else {
						// nedbStore connection
						if (user.password !== password) {
							return done(null, false, { message: 'Invalid password' })
						}
					}
					return done(null, user)
				});
			}
		));
	}

	// Load Facebook Strategy
	if (config.passports.facebook) {
		// use facebook strategy
		passport.use(new FacebookStrategy({
				clientID: config.facebook.clientID,
				clientSecret: config.facebook.clientSecret,
				callbackURL: config.facebook.callbackURL
			},
			function(accessToken, refreshToken, profile, done) {
				User.findOne({ 'facebook.id': profile.id }, function (err, user) {
					if (err) { return done(err) }
					if (!user) {
						user = new User({
							name: profile.displayName,
							email: profile.emails[0].value,
							username: profile.username,
							provider: 'facebook',
							facebook: profile._json
						})
						user.save(function (err) {
							if (err) console.log(err)
							return done(err, user)
						})
					}
					else {
						return done(err, user)
					}
				});
			}
		));
	}
	return true;
}
