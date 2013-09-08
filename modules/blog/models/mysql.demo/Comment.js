/**
 * Comment Model
 */
module.exports = function(sequelize, DataTypes)
{
    var model = sequelize.define(

        // Define name of the model
        'Comment',

        // Define all properties for the model
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false
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

            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                    notEmpty: false
                }
            },

            twitter: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    notEmpty: true
                }
            },

            website: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    notEmpty: true
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
        singular : 'Comment',
        plural   : 'Comments'
    };

    return model;
};

