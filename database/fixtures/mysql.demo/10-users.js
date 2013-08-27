/**
 * Fixtures for Users-Table
 */
module.exports = function(orm, models, share, utils, callback)
{
    var randomNames = require('password');

    var users = [
        {
            "role_id"  : 1,
            "fullname" : "Nabil Krause",
            "email"    : "nabil.krause@silberlicht.eu",
            "password" : "d3d94aadb0ab7754bd5692ad062737f8"
        },
        {
            "role_id"  : 1,
            "fullname" : "Ralf Grawunder",
            "email"    : "r.grawunder@googlemail.com",
            "password" : "24d9590b297cf55fd3c459d7e054fd5f"
        },
        {
            "role_id"  : 1,
            "fullname" : "Hermann Mayer",
            "email"    : "hermann.mayer92@gmail.com",
            "password" : "894904fa3048a795284a51233792f737"
        },
        {
            "role_id"  : 1,
            "fullname" : "Patrick Jaksch",
            "email"    : "mail@deadly-silence.de",
            "password" : "c4ef76b05908a729f4f857ddee667c14"
        }
    ];

    for (var i = 0; i < 100; i += 1) {

        var name = randomNames(2).split(' ');
        name     = name[0].capitalize() + ' ' + name[1].capitalize();
        var deletedAt = undefined;

        if (Math.round(Math.random())) {
            deletedAt = new Date();
        }

        users.push({
            role_id    : 1,
            fullname   : name,
            email      : (name.replace(' ', '.') + '@' + randomNames(1) + '.com').toLowerCase(),
            password   : 'h4ef76b05908a795284a51233792fe14',
            deleted_at : deletedAt
        });
    }

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

