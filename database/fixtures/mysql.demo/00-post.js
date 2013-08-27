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
        },
        {
            'author_id': '1338',
            'slug': 'test2',
            'title': 'I\'m test no. 2 ...',
            'content': '... and I\'m one step ahead!'
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

