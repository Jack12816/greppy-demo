/**
 * Associations Mapping
 */
module.exports = function(sequelize, models)
{
    /**
     * Posts
     */

    // Post (1) --> (1) User
    models.Post.belongsTo(models.User, {as: 'Author', foreignKey: 'author_id'});

    // User (1) --> (n) Posts
    models.User.hasMany(models.Post, {as: 'PostsCreated', foreignKey: 'author_id'});

    /**
     * Comments
     */

    // Comment (1) --> (1) Post
    models.Comment.belongsTo(models.Post, {as: 'Comment', foreignKey: 'post_id'});

    // Post (1) --> (n) Comments
    models.Post.hasMany(models.Comment, {as: 'Comments', foreignKey: 'post_id'});
};

