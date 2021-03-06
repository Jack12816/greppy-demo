/**
 * User Associations Controller Helper
 *
 * @module blog/helpers/controller/user
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 **/

var async = require('async');

/**
 * @constructor
 */
var UserHelper = function()
{
};

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
            condition: {author: user.id},
            populate: [{path: 'post', select: 'title slug'}]
        }
    ];

    greppy.db.get('mongodb.blog').getORM(function(orm, models) {

        async.map(entities, function(entity, callback) {

            var query = models[entity.name].find(entity.condition);

            if (entity.populate) {

                entity.populate.forEach(function(path) {
                    query = query.populate(path);
                });
            }

            query.exec(function(err, documents) {

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
};

module.exports = UserHelper;

