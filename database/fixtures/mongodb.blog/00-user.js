/**
 * Fixtures for users collection
 */
module.exports = function(orm, models, share, utils, callback)
{
    var records = [
        {
            "role_id"  : 1,
            "fullname" : "Nabil Krause",
            "email"    : "nabil.krause@silberlicht.eu",
            "password" : "d3d94aadb0ab7754bd5692ad062737f8",
            "status"   : "Frontend designer & Core developer"
        },
        {
            "role_id"  : 1,
            "fullname" : "Ralf Grawunder",
            "email"    : "r.grawunder@googlemail.com",
            "password" : "24d9590b297cf55fd3c459d7e054fd5f",
            "status"   : "Core developer"
        },
        {
            "role_id"  : 1,
            "fullname" : "Hermann Mayer",
            "email"    : "hermann.mayer92@gmail.com",
            "password" : "894904fa3048a795284a51233792f737",
            "status"   : "Gang leader"
        },
        {
            "role_id"  : 1,
            "fullname" : "Patrick Jaksch",
            "email"    : "mail@deadly-silence.de",
            "password" : "c4ef76b05908a729f4f857ddee667c14",
            "status"   : "Gang Deputy & Core developer"
        }
    ];

    for (var i = 0; i < 100; i++) {

        records.push({
            role_id: 1,
            fullname: utils.content.fullname(),
            email: utils.content.email(),
            password: utils.content.md5(),
            created_at: utils.content.date(),
            deleted_at: utils.content.optional(utils.content.date())
        });
    }

    async.map(records, function(record, callback) {

        models.User.create(record, function (err, savedUser) {

            if (err) {
                return callback && callback(err);
            }

            callback && callback(null, savedUser);
        });

    }, function(err, records) {

        if (err) {
            return callback && callback(err);
        }

        share.Users = records;
        callback && callback();
    });
}

