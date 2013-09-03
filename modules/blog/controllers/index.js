/**
 * Index Controller
 *
 * @module blog/controller/index
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
    this.viewPath = 'app/';
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
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Post.findAll({
                include: [{model: models.User, as: 'Author'}],
                limit: 20
            }).success(function(records) {

                // Render the view
                res.render(self.view('home'), {
                    posts : records
                });

            }).error(function(err) {
                self.error.showErrorPage(req, res, err);
            });
        });
    }
};

module.exports = IndexController;

