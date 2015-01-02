/**
 * Post Controller
 *
 * @module blog/controller/posts
 * @author Hermann Mayer <jack@hermann-mayer.net>
 */

var slug = require('slug');
var marked = require('marked');

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

        var connection = 'mongodb.blog';
        var entity     = 'Post';

        var criteria = self.dataGrid.buildNoSqlCriteria(req, res, {
            limit        : 10,
            properties   : ['title', 'content', 'slug', 'created_at'],
            fuzzySearch  : true,
            softDeletion : true
        });

        if (!criteria) {
            return;
        }

        var count = function(callback) {

            self.dataGrid.buildNoSqlPagination(criteria, {
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

                models[entity].find(criteria.where)
                              .sort(criteria.order)
                              .skip(criteria.offset)
                              .limit(criteria.limit)
                              .exec(function(err, documents) {

                    if (err) {
                        return self.error.showErrorPage(req, res, err);
                    }

                    callback && callback(null, documents);
                });
            });
        };

        var render = function(pagination, documents) {

            // Render the view
            res.render(self.view(criteria.view), {
                posts: documents,
                pagination: pagination
            });
        };

        if ('_index_rows' === criteria.view) {
            return fetch(render);
        }

        if ('_pagination' === criteria.view) {
            return count(render);
        }

        fetch(function(err, documents) {
            count(function(pagination) {
                render(pagination, documents);
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
    path    : '/:oid',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.Post.findById(req.params.oid, function(err, document) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                if (!document) {
                    return res.render('admin/error/notfound-layout', {
                        entity: 'Blog post'
                    });
                }

                document.content = marked(document.content, {
                    breaks: true
                });

                // Render the view
                res.render(self.view('show'), {
                    post: document
                });
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
    path    : '/:oid/edit',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.Post.findById(req.params.oid, function(err, document) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                // Render the view
                res.render(self.view('edit'), {
                    response: {
                        action : 'update',
                        path   : self.link('update', {oid: document.id})
                    },
                    post: document
                });
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

        // @TODO: Implement login
        if ('production' !== greppy.env) {
            return res.redirect(self.link('index'));
        }

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            var document = new models.Post({
                author: '531bbf0a5ffe09f730d5de5c', // @TODO: Implement login -> <ObjectId>
                title: (req.body.post_title).trim(),
                content: (req.body.post_content).trim(),
                slug: slug((req.body.post_title).trim().toLowerCase())
            });

            document.save(function(err, document) {

                if (err) {
                    self.form.logAndFlash(req, err);
                    return res.redirect(self.link('new'));
                }

                res.redirect(self.link('show', {oid: document.id}));
            });
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
    path    : '/:oid',
    methods : ['POST'],
    action  : function(req, res) {

        // @TODO: Implement login
        if ('production' !== greppy.env) {
            return res.redirect(self.link('index'));
        }

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.Post.findById(req.params.oid, function(err, document) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                if (!document) {
                    return res.redirect(self.link('index'));
                }

                document.title = (req.body.post_title).trim();
                document.content = (req.body.post_content).trim();
                document.slug = slug((req.body.post_title).trim().toLowerCase());
                document.updated_at = new Date();

                document.save(function(err, document) {

                    if (err) {
                        self.form.logAndFlash(req, err);
                        return res.redirect(self.link('edit', {oid: document.id}));
                    }

                    res.redirect(self.link('show', {oid: document.id}));
                });
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
    path    : '/:oid',
    methods : ['DELETE'],
    action  : function(req, res) {

        // @TODO: Implement login
        if ('production' !== greppy.env) {
            return res.redirect(self.link('index'));
        }

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.Post.findById(req.params.oid, function(err, document) {

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
 * Backend action to restore a post.
 *
 * @type {ControllerAction}
 * @public
 */
PostsController.actions.restore =
{
    path    : '/:oid/restore',
    methods : ['POST'],
    action  : function(req, res) {

        // @TODO: Implement login
        if ('production' !== greppy.env) {
            return res.redirect(self.link('index'));
        }

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.Post.findById(req.params.oid, function(err, document) {

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

module.exports = PostsController;

