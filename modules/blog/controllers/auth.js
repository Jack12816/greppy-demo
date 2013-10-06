/**
 * Auth Controller
 *
 * @module blog/controller/auth
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var async = require('async');

/**
 * @constructor
 */
var AuthController = function()
{
    // Call the super constructor
    AuthController.super_.call(this);

    // Define the path to look for views
    this.viewPath = 'auth/';

    // Use the root namespace
    this.options.path = '/';
};

/**
 * Extend Greppy framework base controller
 */
util.inherits(AuthController, greppy.get('http.mvc.controller'));

/**
 * Build the controller instance
 */
AuthController = new AuthController();

/**
 * Deliver the login page.
 *
 * @type {ControllerAction}
 * @public
 */
AuthController.actions.login =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render(self.view('login'));
    }
};

/**
 * Process login.
 *
 * @type {ControllerAction}
 * @public
 */
AuthController.actions.processLogin =
{
    path    : '/login/process',
    methods : ['POST'],
    action  : function(req, res) {

        req.flash('info', 'Not yet implemented.');
        res.redirect('/');
    }
};

/**
 * Deliver the sign up page.
 *
 * @type {ControllerAction}
 * @public
 */
AuthController.actions.signup =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render(self.view('signup'));
    }
};

/**
 * Process sign up.
 *
 * @type {ControllerAction}
 * @public
 */
AuthController.actions.processSignup =
{
    path    : '/signup/process',
    methods : ['POST'],
    action  : function(req, res) {

        req.flash('info', 'Not yet implemented.');
        res.redirect('/');
    }
};

module.exports = AuthController;

