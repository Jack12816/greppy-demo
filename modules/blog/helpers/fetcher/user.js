/**
 * User Associations Fetcher Helper
 *
 * @module blog/helpers/fetcher/user
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 **/

var async = require('async');

/**
 * @constructor
 */
var UserHelper = function()
{
}

/**
 * Populate a user document with all related entities.
 *
 * @param {Object} user - User document
 * @param {Function} callback - Function to call on finish
 * @return void
 */
UserHelper.prototype.fetch = function(user, callback)
{
    var entities = [
        {
            name: 'Post',
            condition: {author: user.id}
        },
        {
            name: 'Comment',
            condition: {email: user.email}
        }
    ];

    greppy.db.get('mongodb.blog').getORM(function(orm, models) {

        async.map(entities, function(entity, callback) {

            models[entity.name].find(entity.condition, function(err, documents) {

                if (err) {
                    return callback && callback(err);
                }

                callback && callback(null, documents);
            });

        }, function(err, results) {

            if (err) {
                return callback && callback(err);
            }

            callback && callback(null, {
                posts    : results[0],
                comments : results[1]
            });
        });
    });
}

module.exports = UserHelper;

