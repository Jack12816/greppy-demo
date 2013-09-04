/**
 * Service Worker Context
 *
 * @module greppy-demo/app/worker/context/service
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var util    = require('util');
var express = require('express');

/**
 * @constructor
 */
var ServiceContext = function()
{
    // Call the super constructor
    ServiceContext.super_.call(this, __filename);

    // Worker context description.
    this.description = 'Service context which houses the project API';

    // Worker context backends configuration.
    this.backends = null

    // Worker context modules configuration.
    this.modules = ['service']

    // Worker context controllers configuration.
    this.controllers = {
        ipc: {
            enabled: true
        }
    };
}

/**
 * Extend the Greppy framework worker context
 */
util.inherits(ServiceContext, greppy.get('app.worker.context'));

/**
 * Worker context configure method.
 */
ServiceContext.prototype.configure = function(app, server, callback)
{
    // Define some Auth stuff
    var arraySource = new (greppy.get('auth.adapter.array'))({
        users: [
            {username: 'admin', password: 'password'}
        ]
    });

    var httpAuth = new (greppy.get('auth.handler.http'))({
        adapter: arraySource
    });

    app.set('auth.http', httpAuth);

    // Start listening for connections
    server.listen(3002);

    callback && callback();
};

module.exports = ServiceContext;

