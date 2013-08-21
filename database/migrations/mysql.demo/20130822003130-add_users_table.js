/**
 * Users Migration
 */
module.exports = {

    // Forward-migration method
    up: function(migration, DataTypes, done)
    {
        migration.createTable(

            // Define name of the table
            'Users',

            // Define all columns for the table
            {
                id:   {
                    type          : DataTypes.INTEGER,
                    autoIncrement : true,
                    primaryKey    : true
                },

                role_id: {
                    type      : DataTypes.INTEGER,
                    allowNull : false
                },

                fullname: {
                    type      : DataTypes.STRING,
                    allowNull : false
                },

                created_at: {
                    type      : DataTypes.DATE,
                    allowNull : true
                },

                updated_at: {
                    type      : DataTypes.DATE,
                    allowNull : true
                },

                deleted_at: {
                    type      : DataTypes.DATE,
                    allowNull : true
                }
            },

            // Specific Options for the table
            {
                engine  : 'InnoDB',
                collate : 'utf8_general_ci'
            }

        ).complete(function(err) {

            migration.addIndex(
                'Users',
                ['role_id'],
                {
                    indexName: 'role_id'
                }
            );

            done();
        });
    },

    // Backward-migration method
    down: function(migration, DataTypes, done)
    {
        migration.dropTable('Users').complete(done);
    }
}
