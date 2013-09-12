/**
 * Post Controller
 *
 * @module blog/controller/posts
 * @author Nabil Krause <nabil.krause@silberlicht.eu>
 */

/**
 * @constructor
 */
var PostsController = function()
{
    // Call the super constructor
    PostsController.super_.call(this);

    // Define the path to look for views
    this.viewPath = 'posts/';
};

/**
 * Extend Greppy framework base controller
 */
util.inherits(PostsController, greppy.get('http.mvc.controller'));

/**
 * Build the controller instance
 */
PostsController = new PostsController();

/**
 * Deliver the posts overview page.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        var connection = 'mysql.demo';
        var entity     = 'Post';

        var criteria = self.dataGrid.buildSqlCriteria(req, res, {
            limit        : 10,
            properties   : ['slug', 'title', 'content', 'created_at'],
            fuzzySearch  : true,
            softDeletion : true,
            entity       : entity
        });

        if (!criteria) {
            return;
        }

        var fetch = function(callback) {

            greppy.db.get(connection).getORM(function(orm, models) {

                criteria.include = [
                    {model: models.User, as: 'Author'},
                    {model: models.Comment, as: 'Comments'}
                ];

                models[entity].findAll({include: criteria.include}).success(function(records) {
                    callback && callback(undefined, records);
                }).error(function(err) {
                    self.error.showErrorPage(req, res, err);
                });
            });
        };

        var render = function(pagination, records) {

            // Render the view
            res.render(self.view(criteria.view), {
                posts      : records,
                pagination : pagination
            });
        };

        fetch(function(err, records) {
            render(null, records);
        });
    }
};

/**
 * Deliver the post details page.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.show =
{
    path    : '/:slug',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Post.find({
                where   : {slug: req.params.slug},
                include : [
                    {model: models.User, as: 'Author'},
                    {model: models.Comment, as: 'Comments'}
                ]
            }).success(function(record) {

                // Render the view
                res.render(self.view('show'), {
                    post: record
                });

            }).error(function(err) {
                self.error.showErrorPage(req, res, err);
            });
        });
    }
};

module.exports = PostsController;

