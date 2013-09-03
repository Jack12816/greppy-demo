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
    // this.options.auth.handler = (require('express')).basicAuth(function(user, pass, callback) {
    //     callback(null, (user === 'admin' && pass === 'unister77'));
    // });

    // this.options.auth.routes = [];

    callback && callback();
}

/**
 * Build the controller instance
 */
module.exports = IndexController = new IndexController();

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
                res.render('app/home', {
                    posts : records
                });

            }).error(function(err) {
                console.log(err);
            });
        });
    }
};

