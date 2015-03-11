var jade = require('jade'),
    path = require('path');

exports.wiretree = function (app, config) {

    //set up view engine
    app.set( 'view engine', 'jade' );

    // Static locals
    app.locals.pkg = config.seo;
    return true;
};