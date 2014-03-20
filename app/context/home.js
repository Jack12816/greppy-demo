/**
 * Home Worker Context
 *
 * @module greppy-demo/app/worker/context/home
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var util    = require('util');
var express = require('express');

/**
 * @constructor
 */
var DemoContext = function()
{
    // Call the super constructor
    DemoContext.super_.call(this, __filename);

    // Worker context description.
    this.description = 'Context for the domain greppy.org';

    // Worker context backends configuration.
    this.backends = null;

    // Worker context modules configuration.
    this.modules = ['home'];

    // Worker context controllers configuration.
    this.controllers = {
        ipc: {
            enabled: false
        }
    }
}

/**
 * Extend the Greppy framework worker context
 */
util.inherits(DemoContext, greppy.get('app.worker.context'));

/**
 * Worker context configure method.
 */
DemoContext.prototype.configure = function(app, server, callback)
{
    // Templating Engine
    app.set('views', process.cwd() + '/modules/home/resources/views/');
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

    // Setup post configure hook
    app.postConfigure = function(app, server, callback) {

        // Add 404 error handler
        app.use(function(req, res, next) {
            res.render('error/notfound-layout', {
                enableCarousel: false
            });
        });

        // Add error handler middleware
        app.use(function(err, req, res, next) {

            logger.error(err.stack);
            res.status(500);
            res.render('error/catch-all', {
                error: err,
                enableCarousel: false
            });
        });

        callback && callback();
    };

    // Start listening for connections
    server.listen(workerConfig.port, workerConfig.host);

    callback && callback();
};

module.exports = DemoContext;

