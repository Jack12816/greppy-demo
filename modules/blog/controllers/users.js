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
    this.viewPath = 'users/';
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
 * Redirect to the index page.
 *
 * @type {ControllerAction}
 * @public
 */
UsersController.actions.index =
{
    methods : ['GET'],
    action  : function(req, res) {

        res.redirect('/');
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
    path    : '/:username',
    methods : ['GET'],
    action  : function(req, res) {

        greppy.db.get('mongodb.blog').getORM(function(orm, models) {

            models.User.findOne(
                {username: req.params.username},
            function(err, document) {

                if (err) {
                    return self.error.showErrorPage(req, res, err);
                }

                if (!document) {
                    return self.error.showErrorPage(
                        req, res, new Error(
                            'User "' + req.params.oid + '" not found'
                        ),
                        'notfound-layout', {entity: 'User'}
                    );
                }

                // Fetch associations
                greppy.helper.get('blog.controller.user').fetch(
                    document,
                function(err, relations) {

                    if (err) {
                        return self.error.showErrorPage(req, res, err);
                    }

                    // Render the view
                    res.render(self.view('show'), {
                        user      : document,
                        relations : relations
                    });
                });
            });
        });
    }
};

module.exports = UsersController;

