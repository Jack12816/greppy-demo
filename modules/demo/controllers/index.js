/**
 * Index Controller
 *
 * @module demo/controller/index
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
 * Deliver the home page.
 *
 * @type {ControllerAction}
 * @public
 */
IndexController.prototype.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render('app/home');
    }
};

/**
 * Deliver the about page.
 *
 * @type {ControllerAction}
 * @public
 */
IndexController.prototype.actions.about =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render('app/about');
    }
};

/**
 * Deliver the imprint page.
 *
 * @type {ControllerAction}
 * @public
 */
IndexController.prototype.actions.imprint =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render('app/imprint');
    }
};

/**
 * Deliver the crew page.
 *
 * @type {ControllerAction}
 * @public
 */
IndexController.prototype.actions.crew =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render('app/crew');
    }
};

/**
 * Deliver the contributors page.
 *
 * @type {ControllerAction}
 * @public
 */
IndexController.prototype.actions.contributors =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render('app/contributors');
    }
};

/**
 * Deliver the terms page.
 *
 * @type {ControllerAction}
 * @public
 */
IndexController.prototype.actions.terms =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render('app/terms');
    }
};

module.exports = IndexController;

