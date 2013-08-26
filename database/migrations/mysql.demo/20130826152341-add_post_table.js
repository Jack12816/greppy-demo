/**
 * Posts Migration
 */
module.exports = {

    // Forward-migration method
    up: function(migration, DataTypes, done)
    {
        migration.createTable(

            // Define name of the table
            'Posts',

            // Define all columns for the table
            {
                id:   {
                    type          : DataTypes.INTEGER,
                    autoIncrement : true,
                    primaryKey    : true
                },

                author_id: {
                    type      : DataTypes.INTEGER,
                    allowNull : false
                },

                slug: {
                    type      : DataTypes.STRING,
                    allowNull : false
                },

                title: {
                    type      : DataTypes.STRING,
                    allowNull : false
                },

                content: {
                    type      : DataTypes.TEXT,
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
            done();
        });
    },

    // Backward-migration method
    down: function(migration, DataTypes, done)
    {
        migration.dropTable('Posts').complete(done);
    }
}
