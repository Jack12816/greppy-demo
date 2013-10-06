/**
 * Fixtures for comments collection
 */
module.exports = function(orm, models, share, utils, callback)
{
    var records = [];
    var relations = [];

    for (var i = 0; i < 300; i++) {

        var user = utils.content.optional(share.Users[utils.content.integer(0, 10)]);
        // var user = share.Users[utils.content.integer(0, 10)];

        var comment = {
            title: utils.content.word(),
            content: utils.content.word(50),
            created_at: utils.content.date(),
            updated_at: utils.content.optional(utils.content.date()),
            deleted_at: null //utils.content.optional(utils.content.date())
        };

        if (!user) {
            comment.fullname = utils.content.fullname();
            comment.email    = utils.content.email();
            comment.twitter  = utils.content.optional(utils.content.username());
            comment.website  = utils.content.optional(utils.content.domain());
        } else {
            comment.author = user.id;
        }

        records.push(comment);
    }

    // Insert new comments, in parallel
    async.map(records, function(comment, callback) {

        var post     = share.Posts[utils.content.integer(0, share.Posts.length - 1)];
        comment.post = post.id;

        models.Comment.create(comment, function (err, savedComment) {

            if (err) {
                return callback && callback(err);
            }

            // Save relation for delayed rewrite
            relations.push({comment: savedComment, post: post});

            callback && callback(null, savedComment);
        });

    }, function(err, records) {

        if (err) {
            return callback && callback(err);
        }

        // Rewrite post-comment relations, in series
        async.eachSeries(relations, function(relation, callback) {

            relation.post.comments.push(relation.comment.id);

            relation.post.save(function (err) {

                if (err) {
                    return callback && callback(err);
                }

                callback && callback();
            });

        }, function(err) {

            if (err) {
                return callback && callback(err);
            }

            share.Comments = records;
            callback && callback();
        });







    });
}

