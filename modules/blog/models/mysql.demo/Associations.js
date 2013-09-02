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
};