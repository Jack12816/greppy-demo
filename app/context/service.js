/**
 * Service Worker Context
 *
 * @module greppy-demo/app/worker/context/service
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var util = require('util');

/**
 * @constructor
 */
var ServiceContext = function()
{
    // Call the super constructor
    ServiceContext.super_.call(this, __filename);
}

/**
 * Extend the Greppy framework worker context
 */
util.inherits(ServiceContext, greppy.get('app.worker.context'));

/**
 * Worker context description.
 */
ServiceContext.prototype.description = 'Service context which houses the project API';

/**
 * Worker context backends configuration.
 */
ServiceContext.prototype.backends = {};

/**
 * Worker context modules configuration.
 */
ServiceContext.prototype.modules = ['service'];

/**
 * Worker context controllers configuration.
 */
ServiceContext.prototype.controllers = {
    ipc: {
        enabled: true
    }
};

/**
 * Worker context configure method.
 */
ServiceContext.prototype.configure = function(app, server, callback)
{
    // Start listening for connections
    server.listen(1338);

    callback && callback();
};

module.exports = ServiceContext;

