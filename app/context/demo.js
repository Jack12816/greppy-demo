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
}

/**
 * Extend the Greppy framework worker context
 */
util.inherits(DemoContext, greppy.get('app.worker.context'));

/**
 * Worker context description.
 */
DemoContext.prototype.description = 'Demo frontend context for the domain greppy.org';

/**
 * Worker context backends configuration.
 */
DemoContext.prototype.backends = {};

/**
 * Worker context modules configuration.
 */
DemoContext.prototype.modules = ['demo'];

/**
 * Worker context controllers configuration.
 */
DemoContext.prototype.controllers = {
    ipc: {
        enabled: false
    }
};

/**
 * Worker context configure method.
 */
DemoContext.prototype.configure = function(app, server, callback)
{
    app.use(express.static(process.cwd() + '/public'));
    app.set('views', process.cwd() + '/modules/demo/resources/views');
    app.set('view engine', 'jade');
    app.locals.pretty = true;

    // Start listening for connections
    server.listen(8337);

    callback && callback();
};

module.exports = DemoContext;

