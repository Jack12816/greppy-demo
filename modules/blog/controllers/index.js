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

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Post.findAll({
                include: [{model: models.User, as: 'Author'}]
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

module.exports = IndexController;

