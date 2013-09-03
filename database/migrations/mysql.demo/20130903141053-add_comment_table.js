/**
 * Comments Migration
 */
module.exports = {

    // Forward-migration method
    up: function(migration, DataTypes, done)
    {
        migration.createTable(

            // Define name of the table
            'Comments',

            // Define all columns for the table
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },

                title: {
                    type: DataTypes.STRING,
                    allowNull: false
                },

                content: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },

                email: {
                    type: DataTypes.STRING,
                    allowNull: false
                },

                twitter: {
                    type: DataTypes.STRING,
                    allowNull: true
                },

                website: {
                    type: DataTypes.STRING,
                    allowNull: true
                },

                created_at: {
                    type: DataTypes.DATE,
                    allowNull: true
                },

                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true
                },

                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true
                }
            },

            // Specific Options for the table
            {
                engine  : 'InnoDB',
                collate : 'utf8_general_ci'
            }

        ).complete(function(err) {
            done();
        });
    },

    // Backward-migration method
    down: function(migration, DataTypes, done)
    {
        migration.dropTable('Comments').complete(done);
    }
}
