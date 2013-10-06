/**
 * Archive Controller
 *
 * @module blog/controller/posts
 * @author Nabil Krause <nabil.krause@silberlicht.eu>
 */

var async  = require('async');

/**
 * @constructor
 */
var ArchiveController = function()
{
    // Call the super constructor
    ArchiveController.super_.call(this);

    // Define the path to look for views
    this.viewPath = 'posts/';
};

/**
 * Extend Greppy framework base controller
 */
util.inherits(ArchiveController, greppy.get('http.mvc.controller'));

/**
 * Build the controller instance
 */
ArchiveController = new ArchiveController();

/**
 * Redirect the user to the index page.
 *
 * @type {ControllerAction}
 * @public
 */
ArchiveController.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        res.redirect('/');
    }
}

/**
 * Deliver the post details page.
 *
 * @type {ControllerAction}
 * @public
 */
ArchiveController.actions.show =
{
    path    : '/:year/:month',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            var start = new Date(req.params.year, req.params.month - 1, 1);
            var end   = new Date(req.params.year, req.params.month, 1);

            async.waterfall([

                function(callback) {

                    models.Post.find({created_at: {"$gte": start, "$lt": end}, deleted_at: null})
                               .sort({created_at: -1})
                               .populate('author')
                               .populate('comments')
                               .exec(function(err, posts) {

                        if (err) {
                            return self.error.showErrorPage(req, res, err);
                        }

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
                res.render(self.view('archive'), {
                    posts   : posts,
                    archive : archive,
                    date    : start
                });
            });
        });
    }
};

module.exports = ArchiveController;

