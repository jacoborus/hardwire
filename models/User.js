
var Schema, authTypes, crypto;


exports.wiretree = function (tools, config, mongoose) {

	var uniid = tools.uniid;

	Schema = mongoose.Schema;

	crypto = require('crypto');

	authTypes = ["local"];
	/*
		User Schema -----------------------
	 */
	var UserSchema, validatePresenceOf;
	UserSchema = new Schema({
		email: {
			type: String,
			"default": "",
			unique: true
		},
		since: {
			type: Date,
			required: true,
			"default": new Date()
		},
		provider: {
			type: String,
			"default": ""
		},
		hashed_password: {
			type: String,
			required: true,
			"default": ""
		},
		password2: {
			type: String
		},
		confirmHash: {
			type: String,
			unique: true
		},
		rol: {
			type: String,
			required: true,
			"default": "Registrado"
		},
		salt: {
			type: String,
			"default": ""
		},
		authToken: {
			type: String,
			"default": ""
		},
		ident: {
			type: String
		},
		identOk: {
			type: Boolean
		},
		lastVisit: {
			type: Date,
			required: true,
			"default": Date.now
		},
		credits: {
			type: Number,
			"default": 0
		},
		activo: {
			type: Boolean
		}
	});

	/*
		Virtuals ---------------------------------------------------
	 */
	UserSchema.virtual( "password" ).set( function (password) {
		console.log('virtual passs');
		this._password = password;
		this.salt = this.makeSalt();
		return this.hashed_password = this.encryptPassword(password);
	}).get( function () {
		return this._password;
	});


	/*
		Validations -----------------------------------------------------------------
	 */
	validatePresenceOf = function(value) {
		return value && value.length;
	};
	UserSchema.path("email").validate((function (email) {
		if (authTypes.indexOf(this.provider) !== -1) {
			return true;
		}
		return email.length;
	}), "Email cannot be blank");
	UserSchema.path("email").validate((function(email, fn) {
		var User;
		User = mongoose.model("User");
		if (this.isNew || this.isModified("email")) {
			return User.find({
				email: email
			}).exec(function(err, users) {
				return fn(err || users.length === 0);
			});
		} else {
			return fn(true);
		}
	}), "Email already exists");
	UserSchema.path("hashed_password").validate((function(hashed_password) {
		if (authTypes.indexOf(this.provider) !== -1) {
			return true;
		}
		return hashed_password.length;
	}), "Password cannot be blank");

	/*
		Pre-save hooks --------------------------------------------------------------------------
	 */
	UserSchema.pre("validate", function(next) {
		if (this.password2 && this.password2 !== '') {
			if (this.password3 !== this.password) {
				return next(new Error("Las contraseñas no coinciden:" + this.password + "!==" + this.password2));
			} else {
				this.password = this.password2;
				return next();
			}
		} else {
			return next();
		}
	});
	UserSchema.pre("save", function(next) {
		if (!this.isNew) {
			return next();
		}
		this.provider = "local";
		if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
			return next(new Error("Invalid password"));
		} else {
			this.confirmHash = uniid;
			return next();
		}
	});

	/*
		Methods -----------------------------------------------
	 */
	UserSchema.methods = {

		/*
				Authenticate - check if the passwords are the same
				@param {String} plainText
				@return {Boolean}
				@api public
		 */
		authenticate: function(plainText) {
			return this.encryptPassword(plainText) === this.hashed_password;
		},

		/*
				Make salt
				@return {String}
				@api public
		 */
		makeSalt: function() {
			return Math.round(new Date().valueOf() * Math.random()) + "";
		},

		/*
				Encrypt password
				@param {String} password
				@return {String}
				@api public
		 */
		encryptPassword: function(password) {
			var encrypred, err;
			if (!password) {
				return "";
			}
			encrypred = void 0;
			try {
				encrypred = crypto.createHmac("sha1", this.salt).update(password).digest("hex");
				return encrypred;
			} catch (_error) {
				err = _error;
				return "";
			}
		}
	};
	return mongoose.model("User", UserSchema);
};

