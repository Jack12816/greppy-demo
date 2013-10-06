/**
 * Fixtures for posts collection
 */
module.exports = function(orm, models, share, utils, callback)
{
    var records = [];

    for (var i = 0; i < 100; i++) {

        records.push({
            author: share.Users[utils.content.integer(0, 4)].id,
            slug: utils.content.word(),
            title: utils.content.word(5),
            content: utils.content.text(),
            views: utils.content.integer(1, 1337),
            created_at: utils.content.date(),
            deleted_at: utils.content.optional(utils.content.date())
        });
    }

    async.map(records, function(record, callback) {

        models.Post.create(record, function (err, savedPost) {

            if (err) {
                return callback && callback(err);
            }

            callback && callback(null, savedPost);
        });

    }, function(err, records) {

        if (err) {
            return callback && callback(err);
        }

        share.Posts = records;
        callback && callback();
    });
}

