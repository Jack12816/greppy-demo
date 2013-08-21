/**
 * Fixtures for Users-Table
 */
module.exports = function(orm, models, share, utils, callback)
{
    var users = [
        {
            "role_id"  : 1,
            "fullname" : "Nabil Krause"
        },
        {
            "role_id"  : 1,
            "fullname" : "Ralf Grawunder"
        },
        {
            "role_id"  : 1,
            "fullname" : "Hermann Mayer"
        },
        {
            "role_id"  : 1,
            "fullname" : "Patrick Jaksch"
        }
    ];

    async.map(users, function(user, callback) {

        models.User.build(user).save().success(function(record) {
            callback && callback(undefined, record);
        }).error(function(err) {
            callback && callback(err);
        });

    }, function(err, records) {

        if (err) {
            return callback && callback(err);
        }

        share.users = records;
        callback && callback();
    });
}

