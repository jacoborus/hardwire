'use strict';

exports.wiretree = function (RebucketSrv, config) {
	var conf = config.buckets.public;
	return new RebucketSrv({
		aws: false,
		safenames: true,
		path: config.folder + '/uploads'
	});
}
