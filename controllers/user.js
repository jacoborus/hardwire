'use strict';

exports.wiretree = function (app, config, log, UserModel) {
	var User = UserModel;
	return {
		logout: function (req, res) {
			req.logout();
			delete req.session.profile;
			return res.redirect('/');
		},
		session: function (req, res) {
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

