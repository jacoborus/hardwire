'use strict';

var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
	path: String,
	hash: String,
	filename: String,
	description: String,
	filetype: String,
	image: Boolean
});

FileSchema.pre( 'save', function (next) {
	if (this.filetype) {
		this.image = this.filetype.split('/')[0] === 'image' ? true : false;
	}
	next();
});

module.exports = {
	wiretree : function () {
		return FileSchema;
	},
	settings : {
		modelName: 'File'
	}
}
