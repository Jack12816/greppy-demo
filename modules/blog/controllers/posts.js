/**
 * Post Controller
 *
 * @module blog/controller/posts
 * @author Nabil Krause <nabil.krause@silberlicht.eu>
 */

var async = require('async');

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
 * Redirect the user to the index page.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        res.redirect('/');
    }
}

/**
 * Search for posts.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.search =
{
    path    : '/search',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            async.waterfall([

                function(callback) {

                    // Skip searching for empty requests
                    if ('' === req.query.q) {
                        return callback && callback(null, []);
                    }

                    var query = {
                        "$regex": '.*' + req.query.q + '.*',
                        "$options": 'i'
                    };

                    models.Post.find({
                                    deleted_at: null,
                                    "$or": [
                                        {title: query},
                                        {content: query}
                                    ]
                                })
                               .sort({created_at: -1})
                               .limit(20)
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
                res.render(self.view('search'), {
                    searchQuery : req.query.q,
                    posts       : posts,
                    archive     : archive
                });
            });
        });
    }
};

/**
 * Show a single post in detail.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.show =
{
    path    : '/:slug',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            async.waterfall([

                // Find the post and populate on the first level
                function(callback) {

                    models.Post.findOne({slug: req.params.slug})
                               .populate('author')
                               .populate('comments')
                               .exec(function(err, post) {

                        if (!post) {
                            return callback && callback(new Error('POST_NOT_FOUND'));
                        }

                        callback && callback(err, post);
                    });
                },

                // Populate all authors of all comments
                function(post, callback) {

                    models.User.populate(post, 'comments.author', function (err, post) {
                        callback && callback(err, post);
                    });
                }

            ], function (err, post) {

                if (err && 'POST_NOT_FOUND' !== err.msg) {
                    return self.error.showErrorPage(req, res, err);
                }

                // Render the view
                res.render(self.view('show'), {
                    post: post
                });

                if (post) {

                    // Update the views counter
                    post.update({$inc: {views:1}}, function(err) {

                        if (err) {
                            self.error.log(req, err);
                        }
                    });
                }
            });
        });
    }
};

module.exports = PostsController;

