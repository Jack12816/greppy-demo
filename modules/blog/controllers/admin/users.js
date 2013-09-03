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

        var connection = 'mysql.demo';
        var entity     = 'User';

        var criteria = self.dataGrid.buildSqlCriteria(req, res, {
            limit        : 10,
            properties   : ['fullname', 'email', 'created_at'],
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
                users: records,
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
 * Deliver the user details page.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.show =
{
    path    : '/:id',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.User.find(req.params.id).success(function(record) {

                // Render the view
                res.render(self.view('show'), {
                    user: record
                });

            }).error(function(err) {
                self.error.showErrorPage(req, res, err);
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
    path    : '/:id/edit',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.User.find(req.params.id).success(function(record) {

                // Render the view
                res.render(self.view('edit'), {
                    response: {
                        action : 'update',
                        path   : self.link('update', {id: req.params.id})
                    },
                    user: record
                });

            }).error(function(err) {
                self.error.showErrorPage(req, res, err);
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

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            var record = models.User.build({
                fullname: (req.body.user_fullname).trim(),
                email: (req.body.user_email).trim(),
                password: (req.body.user_password).trim(),
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
 * Backend action to persist the changed user details.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.update =
{
    path    : '/:id',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.User.find(req.params.id).success(function(record) {

                if (!record) {
                    return res.redirect(self.link('index'));
                }

                record.fullname = (req.body.user_fullname).trim();
                record.email = (req.body.user_email).trim();
                record.password = (req.body.user_password).trim();

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
 * Backend action to delete a user.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.destroy =
{
    path    : '/:id',
    methods : ['DELETE'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.User.find(req.params.id).success(function(record) {

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
 * Backend action to restore a user.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.restore =
{
    path    : '/:id/restore',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.User.find(req.params.id).success(function(record) {

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

module.exports = UsersController;

