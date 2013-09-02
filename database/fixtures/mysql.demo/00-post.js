/**
 * Fixtures for Posts table
 */
module.exports = function(orm, models, share, utils, callback)
{
    var records = [];

    for (var i = 0; i < 100; i++) {

        records.push({
            author_id: 1,
            slug: utils.content.word(),
            title: utils.content.wordgroup(),
            content: utils.content.text(),
            deleted_at: utils.content.optional(utils.content.date())
        });
    }

    async.map(records, function(record, callback) {

        models.Post.build(record).save().success(function(record) {
            callback && callback(undefined, record);
        }).error(function(err) {
            callback && callback(err);
        });

    }, function(err, records) {

        if (err) {
            return callback && callback(err);
        }

        share.Posts = records;
        callback && callback();
    });
}

