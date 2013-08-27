/**
 * Users Controller
 *
 * @module blog/controller/users
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

/**
 * @constructor
 */
var UsersController = function()
{
};

/**
 * Extend Greppy framework base controller
 */
util.inherits(UsersController, greppy.get('http.mvc.controller'));

/**
 * Deliver the users overview page.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.prototype.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        var connection     = 'mysql.demo';
        var entity         = 'User';
        var criteriaHelper = greppy.helper.get('controller.data-grid');

        var criteria = criteriaHelper.buildCriteria(req, res, {
            limit        : 10,
            properties   : ['fullname', 'email', 'created_at'],
            fuzzySearch  : true,
            softDeletion : true
        });

        if (!criteria) {
            return;
        }

        var count = function(callback) {

            criteriaHelper.buildPagination(criteria, {
                connection : connection,
                entity     : entity
            }, function(err, pagination) {

                if (err) {
                    console.log(err);
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
                    console.log(err);
                });
            });
        };

        var render = function(pagination, records) {

            // Render the view
            res.render('users/' + criteria.view, {
                users      : records,
                pagination : pagination
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
UsersController.prototype.actions.show =
{
    path    : '/:id',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.User.find(req.params.id).success(function(record) {

                // Render the view
                res.render('users/show', {
                    user: record
                });

            }).error(function(err) {
                console.log();
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
UsersController.prototype.actions.new =
{
    methods : ['GET'],
    action  : function(req, res) {

        // Render the view
        res.render('users/new', {
            response: {
                action : 'create',
                path   : '/users'
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
UsersController.prototype.actions.edit =
{
    path    : '/:id/edit',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.User.find(req.params.id).success(function(record) {

                // Render the view
                res.render('users/edit', {
                    response: {
                        action : 'update',
                        path   : '/users/' + req.params.id
                    },
                    user: record
                });

            }).error(function(err) {
                Helper.get('controller.error').logAndForwardToErrorPage(req, res, err);
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
UsersController.prototype.actions.create =
{
    path    : '/',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            var record = models.User.build({
                role_id  : 1,
                fullname : req.body.user_fullname,
                email    : req.body.user_email,
                password : (require('crypto')).createHash('md5')
                                .update(req.body.user_password, 'utf8').digest('hex')
            });

            var validErr = record.validate();

            if (validErr) {

                console.log(validErr);
                return res.redirect('/users/new');

            } else {

                record.save().success(function(record) {
                    res.redirect('/users/' + record.id);
                }).error(function(err) {
                    console.log(err);
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
UsersController.prototype.actions.update =
{
    path    : '/:id',
    methods : ['POST'],
    action  : function(req, res) {

        greppy.db.get('mysql.demo').getORM(function(orm, models) {

            models.User.find(req.params.id).success(function(record) {

                if (!record) {
                    return res.redirect('/users');
                }

                record.fullname = req.body.user_fullname;
                record.email    = req.body.user_email;
                record.password = (require('crypto')).createHash('md5')
                                    .update(req.body.user_password, 'utf8').digest('hex');

                var validErr = record.validate();

                if (validErr) {

                    console.log(validErr);
                    return res.redirect('/users/' + record.id + '/edit');

                } else {

                    record.save().success(function(record) {
                        res.redirect('/users/' + record.id);
                    }).error(function(err) {
                        console.log(err);
                    });
                }

            }).error(function(err) {
                console.log(err);
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
UsersController.prototype.actions.destroy =
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
                    console.log(err);
                });

            }).error(function(err) {
                console.log(err);
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
UsersController.prototype.actions.restore =
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
                    console.log(err);
                });

            }).error(function(err) {
                console.log(err);
            });
        });
    }
};

module.exports = UsersController;

