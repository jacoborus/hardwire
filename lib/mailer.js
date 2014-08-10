'use strict';
// Get dependencies
var mailer = require("dotmail");


exports.wiretree = function (config, log, MailTemplate) {

	var accounts = config.emailAccounts,
		i;

	for (i in accounts) {
		mailer.addAccount( i, accounts[i] );
	}

	return mailer;
}