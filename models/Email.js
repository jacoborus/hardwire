'use strict';

var Schema;

exports.wiretree = function (tools, config, mongoose) {

	Schema = mongoose.Schema;

	/*
		Email Schema -----------------------
	 */
	var EmailSchema = new Schema({
		account: {
			type: String,
			required: true
		},
		user: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		host: String,
		port: Number,
		ssl: Boolean,
		tls: Boolean,
		timeout: Number,
		domain: String
	});

	return mongoose.model('Email', EmailSchema);
};
