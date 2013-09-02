/**
 * Post Model
 */
module.exports = function(sequelize, DataTypes)
{
    var model = sequelize.define(

        // Define name of the model
        'Post',

        // Define all properties for the model
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            author_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    isInt: true,
                    notEmpty: false
                }
            },

            slug: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: false
                }
            },

            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: false
                }
            },

            content: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: false
                }
            },

            deleted_at: {
                type: DataTypes.DATE
            }
        },

        // Specific Options for the model
        {
            underscored : true,
            charset     : 'utf8',
            collate     : 'utf8_general_ci',
            timestamps  : true
        }
    );

    model.info = {
        singular : 'Post',
        plural   : 'Posts'
    };

    return model;
}

