/**
 * Index Controller
 *
 * @module docs/controller/index
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var async = require('async');
var fs = require('fs');

/**
 * @constructor
 */
var IndexController = function()
{
    // Call the super constructor
    IndexController.super_.call(this);

    // Define the path to look for views
    this.viewPath = 'index/';
};

/**
 * Extend Greppy framework base controller
 */
util.inherits(IndexController, greppy.get('http.mvc.controller'));

/**
 * Build the controller instance
 */
IndexController = new IndexController();

/**
 * Deliver the home page.
 *
 * @type {ControllerAction}
 * @public
 */
IndexController.actions.index =
{
    path    : '/:page?',
    methods : ['GET'],
    action  : function(req, res) {

        async.waterfall([

            // Build the view path
            function(callback) {

                if (!req.params.page) {
                    req.params.page = 'index';
                }

                callback && callback(
                    null, self.view(req.params.page)
                );
            },

            // Check the view
            function(view, callback) {
                fs.exists(req.app.get('views') + view + '.jade', function(exists) {
                    callback && callback(
                        exists ? null : new Error('VIEW_NOT_FOUND'),
                        view
                    );
                })
            }

        ], function(err, view) {

            if (err) {
                return res.render('error/notfound-layout', {
                    enableCarousel: false
                });
            }

            res.render(view);
        });
    }
};

module.exports = IndexController;

