/**
 * Blog Worker Context
 *
 * @module greppy-demo/app/worker/context/blog
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var util     = require('util');
var express  = require('express');
var passport = require('passport');

/**
 * @constructor
 */
var BlogContext = function()
{
    // Call the super constructor
    BlogContext.super_.call(this, __filename);

    // Worker context description.
    this.description = 'Context for the domain blog.greppy.org';

    // Worker context backends configuration.
    // Setting this value to null no database
    // connection will be established. Setting
    // this value to an empty object will load
    // all connections of all backends. You can
    // add an "mysql" property with an array with
    // the names of your connections, so we will
    // only load them. An empty array for an property
    // will load all connections of the given backend.
    this.backends = {
        mongodb: [] // All MongoDB connections
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
    app.locals.pretty  = true;
    app.locals.package = require(process.cwd() + '/package.json');

    // Common Middleware
    app.use(express.compress());
    app.use(express.static(process.cwd() + '/public'));

    // Session ecosystem middleware
    app.use(express.cookieParser('jowluzvurn0ortalNik&'));
    app.use(express.session({
        key: 'greppyUserSess',
        cookie: { maxAge: 7200000 },
        secret: 'AcobMydofs=ObeejVoc1',
        store: new (require('connect-mongo')(express))({
            collection: 'sessions',

            // We use the Mongoose connection for our session store
            mongoose_connection: greppy.db.get('mongodb.blog').orm.instance
        })
    }));
    app.use((require('connect-flash'))());

    // Live-reload on development environments
    if ('development' === greppy.env) {
        app.use(require('connect-livereload')({
            port: 35729
        }));
    }

    // // Authentication
    // passport.use(new (require('passport-local').Strategy)({
    //         usernameField: 'user_username',
    //         passwordField: 'user_password'
    //     },
    //     function(username, password, done) {

    //         // @TODO: Lookup user
    //         // @TODO: Check credentials
    //         // -> done(null, false)
    //         // -> done(null, userObj)

    //         return done(null, {user: true});
    //     }
    // ));

    // passport.serializeUser(function(user, done) {
    //     done(null, JSON.stringify(user));
    // });

    // passport.deserializeUser(function(user, done) {
    //     done(null, JSON.parse(user));
    // });

    // app.use(passport.initialize());
    // app.use(passport.session());

    // Setup post configure hook
    app.postConfigure = function(app, server, callback) {

        // Add 404 error handler
        app.use(function(req, res, next) {
            res.render('error/notfound-layout');
        });

        // Add error handler middleware
        app.use(function(err, req, res, next) {

            logger.error(err.stack);
            res.status(500);
            res.render('error/catch-all', { error: err });
        });

        callback && callback();
    };

    // Start listening for connections
    server.listen(workerConfig.port, workerConfig.host);

    callback && callback();
};

module.exports = BlogContext;

