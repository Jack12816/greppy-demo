/**
 * Frontend Worker Context
 *
 * @module greppy-demo/app/worker/context/frontend
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
    this.description = 'Context for the domain frontend.greppy.org';

    // Worker context backends configuration.
    this.backends = null;

    // Worker context modules configuration.
    this.modules = ['frontend'];

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
    app.set('views', process.cwd() + '/modules/frontend/resources/views/');
    app.set('view engine', 'jade');
    app.locals.pretty = true;

    // Common Middleware
    app.use(express.compress());
    app.use(express.static(process.cwd() + '/public'));

    // Start listening for connections
    server.listen(3001);

    callback && callback();
};

module.exports = DemoContext;

