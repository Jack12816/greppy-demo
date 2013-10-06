/**
 * User Controller
 *
 * @module blog/controller/users
 * @author Hermann Mayer <jack@hermann-mayer.net>
 */

/**
 * @constructor
 */
var UsersController = function()
{
    // Call the super constructor
    UsersController.super_.call(this);

    // Define the path to look for views
    this.viewPath = 'admin/users/';
};

/**
 * Extend Greppy framework base controller
 */
util.inherits(UsersController, greppy.get('http.mvc.controller'));

/**
 * Build the controller instance
 */
UsersController = new UsersController();

/**
 * Deliver the users overview page.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        var connection = 'mongodb.blog';
        var entity     = 'User';

        var criteria = self.dataGrid.buildNoSqlCriteria(req, res, {
            limit        : 10,
            properties   : ['username', 'email', 'fullname', 'created_at'],
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
                users: documents,
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
 * Deliver the user details page.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.show =
{
    path    : '/:oid',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.User.findById(req.params.oid, function(err, document) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                // Render the view
                res.render(self.view('show'), {
                    user: document
                });
            });
        });
    }
};

/**
 * Deliver the new user page.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.new =
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
 * Deliver the edit user page.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.edit =
{
    path    : '/:oid/edit',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.User.findById(req.params.oid, function(err, document) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                // Render the view
                res.render(self.view('edit'), {
                    response: {
                        action : 'update',
                        path   : self.link('update', {oid: document.id})
                    },
                    user: document
                });
            });
        });
    }
};

/**
 * Backend action to persist a new user.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.create =
{
    path    : '/',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            var document = new models.User({
                username: (req.body.user_username).trim(),
                email: (req.body.user_email).trim(),
                password: (req.body.user_password).trim(),
                fullname: (req.body.user_fullname).trim(),
                twitter: (req.body.user_twitter).trim(),
                website: (req.body.user_website).trim(),
                status: (req.body.user_status).trim(),
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
 * Backend action to persist the changed user details.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.update =
{
    path    : '/:oid',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.User.findById(req.params.oid, function(err, document) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                if (!document) {
                    return res.redirect(self.link('index'));
                }

                document.username = (req.body.user_username).trim();
                document.email = (req.body.user_email).trim();
                document.password = (req.body.user_password).trim();
                document.fullname = (req.body.user_fullname).trim();
                document.twitter = (req.body.user_twitter).trim();
                document.website = (req.body.user_website).trim();
                document.status = (req.body.user_status).trim();
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
 * Backend action to delete a user.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.destroy =
{
    path    : '/:oid',
    methods : ['DELETE'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.User.findById(req.params.oid, function(err, document) {

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
 * Backend action to restore a user.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.restore =
{
    path    : '/:oid/restore',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.User.findById(req.params.oid, function(err, document) {

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

module.exports = UsersController;

