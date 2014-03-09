/**
 * Comment Controller
 *
 * @module blog/controller/comments
 * @author Hermann Mayer <jack@hermann-mayer.net>
 */

var async = require('async');

/**
 * @constructor
 */
var CommentsController = function()
{
    // Call the super constructor
    CommentsController.super_.call(this);

    // Define the path to look for views
    this.viewPath = 'comments/';
};

/**
 * Extend Greppy framework base controller
 */
util.inherits(CommentsController, greppy.get('http.mvc.controller'));

/**
 * Build the controller instance
 */
CommentsController = new CommentsController();

/**
 * Backend action to persist a new comment.
 *
 * @type {ControllerAction}
 * @public
 */
CommentsController.actions.create =
{
    path    : '/',
    methods : ['POST'],
    action  : function(req, res) {

        var responseUrl = 'back';

        async.waterfall([

            // Validate the captcha
            function(callback) {
                greppy.helper.get('blog.controller.post')
                    .validateCaptcha(
                        Number(req.body.comment_captcha), req, callback
                    );
            },

            // Find the post
            function(callback) {
                greppy.db.get('mongodb.blog').getORM(function(orm, models) {
                    models.Post.findById(
                        (req.body.comment_post_id).trim(),
                    function(err, post) {

                        responseUrl = res.link('posts', 'show', {slug: post.slug});

                        if (!post) {
                            return callback && callback(
                                new Error('Post was not found')
                            );
                        }

                        callback && callback(err, post);
                    });
                });
            },

            // Save the new comment
            function(post, callback) {
                greppy.db.get('mongodb.blog').getORM(function(orm, models) {
                    var comment = new models.Comment({
                        post     : post.id,
                        fullname : (req.body.comment_fullname).trim(),
                        title    : (req.body.comment_title).trim(),
                        content  : (req.body.comment_content).trim(),
                        email    : (req.body.comment_email).trim(),
                        twitter  : (req.body.comment_twitter).trim(),
                        website  : (req.body.comment_website).trim(),
                    });

                    comment.save(function(err, comment) {
                        callback && callback(err, post, comment);
                    });
                });
            },

            // Update the post
            function(post, comment, callback) {
                post.comments.push(comment.id);
                post.save(function(err, post) {
                    callback && callback(err, post, comment);
                });
            }

        ], function(err, post, comment) {

            if (err) {

                if ('NO_CAPTCHA' === err.message) {
                    err.message = 'The security code is invalid.';
                }

                if ('INVALID_CAPTCHA' === err.message) {
                    err.message = 'The security code is invalid. ' +
                        '(' + req.session.captcha.question + ' = <b>' +
                        req.session.captcha.solution + '</b>, not ' +
                        req.body.comment_captcha + ')';
                }

                self.form.logAndFlash(req, err);
                return res.redirect(responseUrl);
            }

            req.flash('success',
                'Saved your <a class="alert-link" href="#comment-' +
                comment.slug + '">comment</a>.'
            );

            res.redirect(responseUrl);
        });
    }
};

/**
 * Backend action to persist the changed comment details.
 *
 * @type {ControllerAction}
 * @public
 */
CommentsController.actions.update =
{
    path    : '/:oid',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.Comment.findById(req.params.oid, function(err, document) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                if (!document) {
                    return res.redirect(self.link('index'));
                }

                document.fullname = (req.body.comment_fullname).trim();
                document.title = (req.body.comment_title).trim();
                document.content = (req.body.comment_content).trim();
                document.email = (req.body.comment_email).trim();
                document.twitter = (req.body.comment_twitter).trim();
                document.website = (req.body.comment_website).trim();
                document.updated_at = new Date();

                document.save(function(err, document) {

                    if (err) {
                        self.form.logAndFlash(req, err);
                        return res.redirect(self.link('edit', {oid: document.id}));
                    }

                    req.flash('success', 'Your comment was updated');
                    res.redirect(self.link('show', {oid: document.id}));
                });
            });
        });
    }
};

/**
 * Backend action to delete a comment.
 *
 * @type {ControllerAction}
 * @public
 */
CommentsController.actions.destroy =
{
    path    : '/:oid',
    methods : ['DELETE'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.Comment.findById(req.params.oid, function(err, document) {

                if (err) {
                    return res.json(500, {err: err});
                }

                if (!document) {
                    return res.end();
                }

                document.deleted_at = new Date();

                document.save(function(err, document) {

                    if (err) {
                        return res.json(500, {err: err});
                    }

                    res.end();
                });
            });
        });
    }
};

/**
 * Backend action to restore a comment.
 *
 * @type {ControllerAction}
 * @public
 */
CommentsController.actions.restore =
{
    path    : '/:oid/restore',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.Comment.findById(req.params.oid, function(err, document) {

                if (err) {
                    return res.json(500, {err: err});
                }

                if (!document) {
                    return res.end();
                }

                document.deleted_at = null;

                document.save(function(err, document) {

                    if (err) {
                        return res.json(500, {err: err});
                    }

                    res.end();
                });
            });
        });
    }
};

module.exports = CommentsController;

