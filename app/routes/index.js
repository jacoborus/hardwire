'use strict';

module.exports.wiretree = function (app, express, models, control) {

	app.route('/').get( control.main.index );
	return true;
};
