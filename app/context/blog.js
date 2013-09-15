/**
 * Blog Worker Context
 *
 * @module greppy-demo/app/worker/context/blog
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var util    = require('util');
var express = require('express');

/**
 * @constructor
 */
var BlogContext = function()
{
    // Call the super constructor
    BlogContext.super_.call(this, __filename);

    // Worker context description.
    this.description = 'Blog frontend context for the domain greppy.org';

    // Worker context backends configuration.
    this.backends = {
        mysql: [] // All MySQL connections
    };

    // Worker context modules configuration.
    this.modules = ['blog'];

    // Worker context controllers configuration.
    this.controllers = {
        ipc: {
            enabled: false
        }
    };
}

/**
 * Extend the Greppy framework worker context
 */
util.inherits(BlogContext, greppy.get('app.worker.context'));

/**
 * Worker context configure method.
 */
BlogContext.prototype.configure = function(app, server, callback)
{
    // Templating Engine
    app.set('views', process.cwd() + '/modules/blog/resources/views');
    app.set('view engine', 'jade');
    app.locals.pretty = true;

    // Common Middleware
    app.use(express.compress());
    app.use(express.static(process.cwd() + '/public'));

    // Start listening for connections
    server.listen(3001);

    callback && callback();
};

module.exports = BlogContext;

