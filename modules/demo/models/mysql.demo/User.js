/**
 * User Model
 */
module.exports = function(sequelize, DataTypes)
{
    var model = sequelize.define(

        // Define name of the model
        'User',

        // Define all properties for the model
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            role_id: {
                type: DataTypes.INTEGER,
                validate: {
                    isInt: true
                }
            },

            fullname: {
                type: DataTypes.STRING,
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
        singular: 'User',
        plural: 'Users',
        path: '/users'
    };

    return model;
}

