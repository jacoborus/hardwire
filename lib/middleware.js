'use strict';

var path = require('path'),
	favicon = require('static-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	errorHandler = require('errorhandler'),
	compression = require('compression'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('connect-flash'),
	rootPath = __dirname + '/../..',
	timeOut = require('./timeout.js')(),
	bodyParser = require('body-parser'),
	multer  = require('multer');



// Middleware

exports.wiretree = function (app, express, config, User) {

	var SessionStore, sessionStore, sessionConfig;

	app.set('showStackError', true);

	app.use( favicon() );
	if ( process.env.NODE_ENV !== 'production' ) {
		app.use(logger('dev'));
	}

	// Error handler
	var error_middleware = errorHandler({
		dumpExceptions:true,
		showStack:true
	});

	// should be placed before express.static
	app.use( compression({
		filter: function (req, res) {
			return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
		},
		level: 9
	}));
	// set views folder
	app.set( 'views', path.resolve( config.folder, 'app/views' ));
	app.use( '/uploads', express.static( path.resolve( config.folder, 'datapack/uploads' )));
	app.use(express.static( path.resolve( config.folder, 'app/public')));

	// add public folders from config
	var folder;
	for (folder in config.publicFolders) {
		app.use( folder, express.static( rootPath + config.publicFolders[folder] ));
	}


	app.use( timeOut );       // request timeouts

	// cookieParser should be above session
	app.use(cookieParser());

	// bodyParser should be above methodOverride
	var tempParser = config.tempFolder ? {uploadDir: rootPath + '/' + config.tempFolder} : {};
	app.use(bodyParser({ dest: tempParser }));
	var tempFolder = path.resolve( rootPath, config.tempFolder);
	app.use(multer({ dest: tempFolder}));
	app.use(methodOverride());

	/*
	 * Session storage  ----------------------------------------
	 */
	SessionStore = require('connect-mongo')({session: session});
	sessionStore = new SessionStore({
		url: config.mongodb.uri,
		collection : 'sessions'
	});

	sessionConfig = {
		secret: config.session.secret || 'yoursecret',
		key: config.session.key || 'yoursessionkey',
		cookie: {
			path: '/',
			httpOnly: true,
			maxAge: 365 * 24 * 3600 * 1000, // One year for example
		},
		store: sessionStore
	};
	app.use( session( sessionConfig ));

	// use passport session
	app.use( passport.initialize());
	app.use( passport.session());

	// connect flash for flash messages - should be declared after sessions
	app.use( flash());

	// should be declared after session and flash
	//app.use( helpers( pkg.name ));

/*
	// Handle errors thrown from middleware/routes
	app.use(error_middleware);
	// adds CSRF support
	if (process.env.NODE_ENV !== 'test') {
		app.use( express.csrf());
	}

	// This could be moved to view-helpers :-)
	app.use(function(req, res, next){
		res.locals.csrf_token = req.session._csrf;
		next();
	});
*/

	// enable global url
	app.use(
		function ( req, res, next ) {
			req.globalUrl = config.globalUrl;
			next();
		}
	);

	// enable alert flash messages
	app.use(
		function ( req, res, next ) {
			res.locals.info = req.flash( 'info' );
			res.locals.success = req.flash( 'success' );
			res.locals.errors = req.flash( 'error' );
			res.locals.warning = req.flash( 'warning' );
			next();
		}
	);
	// pasamos roles por req.session para acceder a ellos desde las vistas
	app.use(
		function ( req, res, next ) {
			req.admin = false;
			if ( req.isAuthenticated() ) {

				User.find({_id: req.session.passport.user}, function ( err, data ){
					if ( err ) {
						console.log( err );
						next();
					} else {
						req.session.profile = data[0];
						next();
					}
				});
			} else {
				next();
			}
		}
	);

	// pasa req a locals
	app.use( function ( req, res, next ) {
		res.locals.req = req;
		next();
	});



	// app.configure('development', function () {
	// 	require('express-trace')(app);
	// });
	return true;
};
