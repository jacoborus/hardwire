
var rol,
	__slice = [].slice;

rol = {};

rol.hasLevel = function (level) {

};

rol.hasRole = function (level) {

};

rol.reqRol = function() {
	var roles;
	roles = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	return function(req, res, next) {
		var role, _i, _len;
		for (_i = 0, _len = roles.length; _i < _len; _i++) {
			role = roles[_i];
			if (req.session.profile && req.session.profile.rol === role) {
				return next();
			}
		}
		return res.send(403);
	};
};

rol.sameUser = function() {
	return function(req, res, next) {
		if (req.session.passport && req.session.passport === req.user.id) {
			return next();
		} else {
			return res.send(403);
		}
	};
};

exports.wiretree = function() {
	return rol;
};
