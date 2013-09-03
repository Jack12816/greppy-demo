/**
 * Demo Worker Context
 *
 * @module greppy-demo/app/worker/context/demo
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
    this.description = 'Demo frontend context for the domain greppy.org'

    // Worker context backends configuration.
    this.backends = null

    // Worker context modules configuration.
    this.modules = ['demo']

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
    app.set('views', process.cwd() + '/modules/demo/resources/views/');
    app.set('view engine', 'jade');
    app.locals.pretty = true;

    // Common Middleware
    app.use(express.compress());
    app.use(express.static(process.cwd() + '/public'));

    // Start listening for connections
    server.listen(3000);

    callback && callback();
};

module.exports = DemoContext;

