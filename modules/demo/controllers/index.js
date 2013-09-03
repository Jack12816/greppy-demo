/**
 * Index Controller
 *
 * @module demo/controller/index
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var fs = require('fs');

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
 * Deliver the home page.
 *
 * @type {ControllerAction}
 * @public
 */
IndexController.actions.index =
{
    path    : '/:page?',
    methods : ['GET'],
    action  : function(req, res) {

        if (!req.params.page) {
            req.params.page = 'home';
        }

        var view = 'app/' + req.params.page;

        if (!fs.existsSync(req.app.get('views') + view + '.jade')) {
            return res.render('error/notfound');
        }

        // Render the view
        res.render(view);
    }
};

module.exports = IndexController;

