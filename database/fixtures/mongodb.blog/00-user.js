/**
 * Fixtures for users collection
 */
module.exports = function(orm, models, share, utils, callback)
{
    var records = [
        {
            "role_id"  : 1,
            "username" : "nabil1337",
            "fullname" : "Nabil Krause",
            "email"    : "nabil.krause@silberlicht.eu",
            "password" : "45cfa76082c91e4455dfc770555621ad6c2dae3c26b086f260573f49b83d3e4d9a2cf8dab3d325f7ca428ba4d971ab1df9558bf0f2ee17745025daa87edebdcb",
            "status"   : "Frontend designer & Core developer"
        },
        {
            "role_id"  : 1,
            "username" : "R2-G2",
            "fullname" : "Ralf Grawunder",
            "email"    : "r.grawunder@googlemail.com",
            "password" : "ca35db9670d2a3c0e20de2bf263e09c8cad6c105d4466fb15cdc6c85d497870567e5fc08a8656aa03b83f47a1330b82508cb49e76065f7717421dd56d8e2a610",
            "status"   : "Core developer",
            "website"  : "black-magic-voodoo-stuff.net/"
        },
        {
            "role_id"  : 1,
            "username" : "Jack12816",
            "fullname" : "Hermann Mayer",
            "email"    : "hermann.mayer92@gmail.com",
            "password" : "043e1da47e9deaea443b60a5df1ef04505bd247c4a2ec4acccdae93aad9d65eeabe47ae40d49230b24ae70cdcb0cb47eb6a16c30bfba63568b1a8273c5c0d188",
            "status"   : "Gang leader",
            "website"  : "hermann-mayer.net",
            "twitter"  : "Jack12816"
        },
        {
            "role_id"  : 1,
            "username" : "DeadlySilence",
            "fullname" : "Patrick Jaksch",
            "email"    : "mail@deadly-silence.de",
            "password" : "3000dcf31a250373c5338c911dd77faf9af1eeeadc02b87fa23fb7e3561e177cf34d0240f9e59ab14f0b0587113e0686e4490622e7253c41ffa3a20c339e0c1e",
            "status"   : "Gang Deputy & Core developer"
        },
        {
            "role_id"  : 1,
            "username" : "killmag10",
            "fullname" : "Lars Dietrich",
            "email"    : "killmag10@dietrich-hosting.de",
            "password" : "0e97cb602cbf9deda447db33e4a5dc3b3a7413a315d5aa91595ff443268d9d4e104b211212e104126b2737af1c40d4c1490545f28d4cc11bc82181e3c68aab50",
            "status"   : "Quality assurance & Core developer"
        }
    ];

    for (var i = 0; i < 100; i++) {

        records.push({
            role_id: 1,
            username: utils.content.username(),
            fullname: utils.content.fullname(),
            email: utils.content.email(),
            password: utils.content.sha512(),
            twitter: utils.content.optional(utils.content.username()),
            website: utils.content.optional(utils.content.domain()),
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
};

