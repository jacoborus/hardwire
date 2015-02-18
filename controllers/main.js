'use strict';

exports.wiretree = function () {

	var mod = {};

	mod.index =  function (req, res, next) {
		res.render('index', {
			title: 'Hardwire CMS',
			data: {}
		});
	};

	mod.login =  function (req, res, next) {
		res.render('user/login', {
			title: 'Login'
		});
	};

	return mod;
};
