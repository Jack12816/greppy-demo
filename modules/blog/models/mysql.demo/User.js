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
                allowNull: false,
                defaultValue: 1,
                validate: {
                    isInt: true,
                    notEmpty: false
                }
            },

            fullname: {
                type: DataTypes.STRING,
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

            password: {
                type: DataTypes.STRING,
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
        singular : 'User',
        plural   : 'Users'
    };

    return model;
}

