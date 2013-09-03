/**
 * Comment Controller
 *
 * @module blog/controller/comments
 * @author Hermann Mayer <jack@hermann-mayer.net>
 */

// Define default helper set
var error    = greppy.helper.get('controller.error');
var form     = greppy.helper.get('controller.form');
var dataGrid = greppy.helper.get('controller.data-grid');

/**
 * @constructor
 */
var CommentsController = function()
{
    // Call the super constructor
    CommentsController.super_.call(this);
};

/**
 * Extend Greppy framework base controller
 */
util.inherits(CommentsController, greppy.get('http.mvc.controller'));

/**
 * Configure the controller.
 *
 * @param {Object} app - The application object
 * @param {Object} server - Server object
 * @param {Function} callback - Function to call on finish
 * @return void
 */
CommentsController.prototype.configure = function(app, server, callback)
{
    callback && callback();
}

/**
 * Build the controller instance
 */
module.exports = CommentsController = new CommentsController();

/**
 * Deliver the comments overview page.
 *
 * @type {ControllerAction}
 * @public
 */
CommentsController.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        var connection = 'mysql.demo';
        var entity     = 'Comment';

        var criteria = dataGrid.buildCriteria(req, res, {
            limit        : 10,
            properties   : ['title', 'content', 'email', 'twitter', 'website', 'created_at'],
            fuzzySearch  : true,
            softDeletion : true
        });

        if (!criteria) {
            return;
        }

        var count = function(callback) {

            dataGrid.buildPagination(criteria, {
                connection : connection,
                entity     : entity
            }, function(err, pagination) {

                if (err) {
                    error.showErrorPage(req, res, err);
                    return res.end();
                }

                callback && callback(pagination);
            });
        };

        var fetch = function(callback) {

            greppy.db.get(connection).getORM(function(orm, models) {

                models[entity].findAll(criteria).success(function(records) {
                    callback && callback(undefined, records);
                }).error(function(err) {
                    error.showErrorPage(req, res, err);
                });
            });
        };

        var render = function(pagination, records) {

            // Render the view
            res.render('comments/' + criteria.view, {
                comments: records,
                pagination: pagination
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
 * Deliver the comment details page.
 *
 * @type {ControllerAction}
 * @public
 */
CommentsController.actions.show =
{
    path    : '/:id',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Comment.find(req.params.id).success(function(record) {

                // Render the view
                res.render('comments/show', {
                    comment: record
                });

            }).error(function(err) {
                error.showErrorPage(req, res, err);
            });
        });
    }
};

/**
 * Deliver the new comment page.
 *
 * @type {ControllerAction}
 * @public
 */
CommentsController.actions.new =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render('comments/new', {
            response: {
                action : 'create',
                path   : '/comments'
            }
        });
    }
};

/**
 * Deliver the edit comment page.
 *
 * @type {ControllerAction}
 * @public
 */
CommentsController.actions.edit =
{
    path    : '/:id/edit',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Comment.find(req.params.id).success(function(record) {

                // Render the view
                res.render('comments/edit', {
                    response: {
                        action : 'update',
                        path   : '/comments/' + req.params.id
                    },
                    comment: record
                });

            }).error(function(err) {
                error.showErrorPage(req, res, err);
            });
        });
    }
};

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

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            var record = models.Comment.build({
                title: (req.body.comment_title).trim(),
                content: (req.body.comment_content).trim(),
                email: (req.body.comment_email).trim(),
                twitter: (req.body.comment_twitter).trim(),
                website: (req.body.comment_website).trim(),
            });

            var validErr = record.validate();

            if (validErr) {

                form.logAndFlash(req, validErr);
                return res.redirect('/comments/new');

            } else {

                record.save().success(function(record) {
                    res.redirect('/comments/' + record.id);
                }).error(function(err) {
                    error.showErrorPage(req, res, err);
                });
            }
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
    path    : '/:id',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Comment.find(req.params.id).success(function(record) {

                if (!record) {
                    return res.redirect('/comments');
                }

                record.title = (req.body.comment_title).trim();
                record.content = (req.body.comment_content).trim();
                record.email = (req.body.comment_email).trim();
                record.twitter = (req.body.comment_twitter).trim();
                record.website = (req.body.comment_website).trim();

                var validErr = record.validate();

                if (validErr) {

                    form.logAndFlash(req, validErr);
                    return res.redirect('/comments/' + record.id + '/edit');

                } else {

                    record.save().success(function(record) {
                        res.redirect('/comments/' + record.id);
                    }).error(function(err) {
                        error.showErrorPage(req, res, err);
                    });
                }

            }).error(function(err) {
                error.showErrorPage(req, res, err);
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
    path    : '/:id',
    methods : ['DELETE'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Comment.find(req.params.id).success(function(record) {

                if (!record) {
                    return res.end();
                }

                record.deleted_at = new Date();

                record.save().success(function(record) {
                    res.end();
                }).error(function(err) {
                    error.showErrorPage(req, res, err);
                });

            }).error(function(err) {
                error.showErrorPage(req, res, err);
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
    path    : '/:id/restore',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Comment.find(req.params.id).success(function(record) {

                if (!record) {
                    return res.end();
                }

                record.deleted_at = undefined;

                record.save().success(function(record) {
                    res.end();
                }).error(function(err) {
                    error.showErrorPage(req, res, err);
                });

            }).error(function(err) {
                error.showErrorPage(req, res, err);
            });
        });
    }
};

