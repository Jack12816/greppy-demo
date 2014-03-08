/**
 * Docs Worker Context
 *
 * @module greppy-demo/app/worker/context/docs
 * @author Hermann Mayer <jack@hermann-mayer.net>
 */

var util    = require('util');
var express = require('express');

/**
 * @constructor
 */
var DocsContext = function()
{
    // Call the super constructor
    DocsContext.super_.call(this, __filename);

    // Worker context description.
    this.description = 'Context for the domain docs.greppy.org';

    // Worker context backends configuration.
    // Setting this value to null no database
    // connection will be established. Setting
    // this value to an empty object will load
    // all connections of all backends. You can
    // add an "mysql" property with an array with
    // the names of your connections, so we will
    // only load them. An empty array for an property
    // will load all connections of the given backend.
    this.backends = null;

    // Worker context modules configuration.
    this.modules = ['docs'];
}

/**
 * Extend the Greppy framework worker context
 */
util.inherits(DocsContext, greppy.get('app.worker.context'));

/**
 * Worker context configure method.
 */
DocsContext.prototype.configure = function(app, server, callback)
{
    // Templating Engine
    app.set('views', process.cwd() + '/modules/docs/resources/views/');
    app.set('view engine', 'jade');
    app.locals.pretty  = true;
    app.locals.package = require(process.cwd() + '/package.json');

    // Common Middleware
    app.use(express.compress());

    if ('development' === greppy.env) {
        app.use(require('connect-livereload')({
            port: 35729
        }));
    }

    app.use(express.static(process.cwd() + '/public'));
    app.use(express.static(process.cwd() + '/public/docs'));

    // Start listening for connections
    server.listen(workerConfig.port, workerConfig.host);

    callback && callback();
};

module.exports = DocsContext;

