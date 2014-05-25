'use strict';

var filtra;

exports.wiretree = function (app, config, log, User) {
	return {
		logout: function (req, res) {
			req.logout();
			delete req.session.profile;
			req.flash('success', 'Sesión cerrada correctamente');
			return res.redirect('/');
		},
		session: function (req, res) {
			console.log( 'req.session.passport.user' );
			console.log( req.session.passport.user );
			User.find({
				_id: req.session.passport.user
			}, function (err, data) {
				if (err) {
					console.log(err);
				} else {
					req.session.profile = data[0];
				}
			});
			res.redirect('/admin');
		},
		signin: function () {},
		authCallback: function (req, res) {
			if (req.session.returnTo) {
				res.redirect(req.session.returnTo);
				delete req.session.returnTo;
				return;
			}
			return res.redirect('/');
		}
	};
};

filtra = {
	update: function (datos) {
		return {
			avatar: 'avatar-' + datos.id + '.jpg',
			nombre: datos.nombre || null
		};
	}
};
