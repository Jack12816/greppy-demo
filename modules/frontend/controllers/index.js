/**
 * Index Controller
 *
 * @module frontend/controller/index
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

/**
 * @constructor
 */
var IndexController = function()
{
    // Call the super constructor
    IndexController.super_.call(this);

    // Define the path to look for views
    this.viewPath = 'index/';
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
            req.params.page = 'index';
        }

        // Render the view
        res.render(self.view(req.params.page), function(err, html) {

            if (err) {
                res.render('error/notfound-layout');
            }

            res.end(html);
        });
    }
};

module.exports = IndexController;

