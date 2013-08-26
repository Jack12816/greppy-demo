/**
 * Fixtures for Posts table
 */
module.exports = function(orm, models, share, utils, callback)
{
    var records = [
        {
            'author_id': 1337,
            'slug': 'test',
            'title': 'test',
            'content': 'test',
        }
    ];

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

