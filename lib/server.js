exports.wiretree = function (app, config) {
    console.log( '[Hardwire application listening on %s]', config.port );
    return app.listen( config.port );
}