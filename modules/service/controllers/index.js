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
};

/**
 * Extend Greppy framework base controller
 */
util.inherits(IndexController, greppy.get('http.mvc.controller'));

/**
 * Get information about our demo service.
 *
 * @type {ControllerAction}
 * @public
 */
IndexController.prototype.actions.index =
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

