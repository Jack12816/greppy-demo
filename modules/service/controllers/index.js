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

