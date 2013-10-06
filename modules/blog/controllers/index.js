/**
 * Index Controller
 *
 * @module blog/controller/index
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var async = require('async');

/**
 * @constructor
 */
var IndexController = function()
{
    // Call the super constructor
    IndexController.super_.call(this);

    // Define the path to look for views
    this.viewPath = 'posts/';
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

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            async.waterfall([

                function(callback) {

                    models.Post.find({deleted_at: null})
                               .sort({created_at: -1})
                               .limit(10)
                               .populate('author')
                               .exec(function(err, posts) {

                        callback && callback(err, posts);
                    });
                },

                function(posts, callback) {

                    greppy.helper.get('blog.fetcher.post').fetchArchive(function(err, archive) {
                        callback && callback(err, posts, archive);
                    });
                }

            ], function (err, posts, archive) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                // Render the view
                res.render(self.view('index'), {
                    posts   : posts,
                    archive : archive
                });
            });
        });
    }
};

module.exports = IndexController;

