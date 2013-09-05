/**
 * Fixtures for Comments table
 */
module.exports = function(orm, models, share, utils, callback)
{
    var records = [];

    for (var i = 0; i < 100; i++) {

        records.push({
            title      : utils.content.wordgroup(),
            content    : utils.content.text(),
            email      : utils.content.email(),
            twitter    : utils.content.optional(utils.content.word()),
            website    : utils.content.optional(utils.content.domain()),
            created_at : utils.content.date(),
            deleted_at : utils.content.optional(utils.content.date())
        });
    }

    async.map(records, function(record, callback) {

        models.Comment.build(record).save().success(function(record) {
            callback && callback(undefined, record);
        }).error(function(err) {
            callback && callback(err);
        });

    }, function(err, records) {

        if (err) {
            return callback && callback(err);
        }

        share.Comments = records;
        callback && callback();
    });
}

