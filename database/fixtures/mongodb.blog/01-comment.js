/**
 * Fixtures for comments collection
 */
module.exports = function(orm, models, share, utils, callback)
{
    var records = [];

    for (var i = 0; i < 100; i++) {

        records.push({
            fullname: utils.content.fullname(),
            title: utils.content.word(),
            content: utils.content.word(50),
            email: share.Users[utils.content.integer(0, 10)].email,
            twitter: utils.content.optional(utils.content.word()),
            website: utils.content.optional(utils.content.domain()),
            created_at: utils.content.date(),
            updated_at: utils.content.optional(utils.content.date()),
            deleted_at: utils.content.optional(utils.content.date())
        });
    }

    async.map(records, function(record, callback) {

        models.Comment.create(record, function (err, savedComment) {

            if (err) {
                return callback && callback(err);
            }

            callback && callback(null, savedComment);
        });

    }, function(err, records) {

        if (err) {
            return callback && callback(err);
        }

        share.Comments = records;
        callback && callback();
    });
}

