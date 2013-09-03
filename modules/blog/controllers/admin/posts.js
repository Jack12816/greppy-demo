/**
 * Post Controller
 *
 * @module blog/controller/posts
 * @author Hermann Mayer <jack@hermann-mayer.net>
 */

/**
 * @constructor
 */
var PostsController = function()
{
    // Call the super constructor
    PostsController.super_.call(this);

    // Define the path to look for views
    this.viewPath = 'admin/posts/';
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
            softDeletion : true
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
                posts: records,
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
 * Deliver the post details page.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.show =
{
    path    : '/:id',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Post.find(req.params.id).success(function(record) {

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

/**
 * Deliver the new post page.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.new =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render(self.view('new'), {
            response: {
                action : 'create',
                path   : self.link('create')
            }
        });
    }
};

/**
 * Deliver the edit post page.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.edit =
{
    path    : '/:id/edit',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Post.find(req.params.id).success(function(record) {

                // Render the view
                res.render(self.view('edit'), {
                    response: {
                        action : 'update',
                        path   : self.link('update', {id: req.params.id})
                    },
                    post: record
                });

            }).error(function(err) {
                self.error.showErrorPage(req, res, err);
            });
        });
    }
};

/**
 * Backend action to persist a new post.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.create =
{
    path    : '/',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            var record = models.Post.build({
                slug: (req.body.post_slug).trim(),
                title: (req.body.post_title).trim(),
                content: (req.body.post_content).trim(),
            });

            var validErr = record.validate();

            if (validErr) {

                self.form.logAndFlash(req, validErr);
                return res.redirect(self.link('new'));

            } else {

                record.save().success(function(record) {
                    res.redirect(self.link('show', {id: record.id}));
                }).error(function(err) {
                    self.error.showErrorPage(req, res, err);
                });
            }
        });
    }
};

/**
 * Backend action to persist the changed post details.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.update =
{
    path    : '/:id',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Post.find(req.params.id).success(function(record) {

                if (!record) {
                    return res.redirect(self.link('index'));
                }

                record.slug = (req.body.post_slug).trim();
                record.title = (req.body.post_title).trim();
                record.content = (req.body.post_content).trim();

                var validErr = record.validate();

                if (validErr) {

                    self.form.logAndFlash(req, validErr);
                    return res.redirect(self.link('edit', {id: record.id}));

                } else {

                    record.save().success(function(record) {
                      res.redirect(self.link('show', {id: record.id}));
                    }).error(function(err) {
                        self.error.showErrorPage(req, res, err);
                    });
                }

            }).error(function(err) {
                self.error.showErrorPage(req, res, err);
            });
        });
    }
};

/**
 * Backend action to delete a post.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.destroy =
{
    path    : '/:id',
    methods : ['DELETE'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Post.find(req.params.id).success(function(record) {

                if (!record) {
                    return res.end();
                }

                record.deleted_at = new Date();

                record.save().success(function(record) {
                    res.end();
                }).error(function(err) {
                    self.error.showErrorPage(req, res, err);
                });

            }).error(function(err) {
                self.error.showErrorPage(req, res, err);
            });
        });
    }
};

/**
 * Backend action to restore a post.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.restore =
{
    path    : '/:id/restore',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.Post.find(req.params.id).success(function(record) {

                if (!record) {
                    return res.end();
                }

                record.deleted_at = undefined;

                record.save().success(function(record) {
                    res.end();
                }).error(function(err) {
                    self.error.showErrorPage(req, res, err);
                });

            }).error(function(err) {
                self.error.showErrorPage(req, res, err);
            });
        });
    }
};

module.exports = PostsController;

