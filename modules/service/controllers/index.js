/**
 * Index Controller
 *
 * @module service/controller/index
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

/**
 * @constructor
 */
var IndexController = function()
{
    // Call the super constructor
    IndexController.super_.call(this);
};

/**
 * Extend Greppy framework base controller
 */
util.inherits(IndexController, greppy.get('http.mvc.controller'));

/**
 * Configure the controller.
 *
 * @param {Object} app - The application object
 * @param {Object} server - Server object
 * @param {Function} callback - Function to call on finish
 * @return void
 */
IndexController.prototype.configure = function(app, server, callback)
{
    this.options.auth.handler = app.get('auth.basicHTTP');
    this.options.auth.routes  = [];

    callback && callback();
};

/**
 * Build the controller instance
 */
IndexController = new IndexController();

/**
 * Get information about our demo service.
 *
 * @type {ControllerAction}
 * @public
 */
IndexController.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        var package = require(process.cwd() + '/package.json');

        res.json({
            name         : package.name,
            description  : package.description,
            version      : package.version,
            contributors : package.contributors
        });
    }
};

module.exports = IndexController;

