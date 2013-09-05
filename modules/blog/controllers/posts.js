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

        var count = function(callback) {

            self.dataGrid.buildSqlPagination(criteria, {
                connection : connection,
                entity     : entity
            }, function(err, pagination) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                callback && callback(pagination);
            });
        };

        var fetch = function(callback) {

            greppy.db.get(connection).getORM(function(orm, models) {

                models[entity].findAll(criteria).success(function(records) {
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

        if ('_index_rows' === criteria.view) {
            return fetch(render);
        }

        if ('_pagination' === criteria.view) {
            return count(render);
        }

        fetch(function(err, records) {
            count(function(pagination) {
                render(pagination, records);
            });
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
                include : [{model: models.User, as: 'Author'}]
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

