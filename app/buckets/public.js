'use strict';

exports.wiretree = function (RebucketSrv, config) {
	return new RebucketSrv({
		aws: false,
		safenames: true,
		path: config.folder + '/uploads'
	});
};
