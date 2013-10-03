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

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.Post.findOne({slug: req.params.slug})
                       .populate('author')
                       .populate('comments')
                       .exec(function(err, document) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                // Render the view
                res.render(self.view('show'), {
                    post: document
                });

                if (document) {

                    // Update the views counter
                    document.update({$inc: {views:1}}, function(err) {

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

