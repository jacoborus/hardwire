'use strict';
// Get dependencies
var mailer = require("curlymail");


exports.wiretree = function (config, log) {

	var accounts = config.emailAccounts,
		i;

	for (i in accounts) {
		mailer.addAccount( i, accounts[i] );
	}

	return mailer;
}