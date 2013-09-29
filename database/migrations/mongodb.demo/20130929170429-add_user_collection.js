/**
 * Users Migration
 */
module.exports = {

    // Forward-migration method
    up: function(db, orm, done)
    {
        db.collection('users', function(err, collection) {

            if (err) {
                return done(err);
            }

            collection.ensureIndex({
                'email': 1,
                'fullname': 1
            }, {
                name: 'email_fullname',
                unique: true,
                background: true
            }, done);
        });
    },

    // Backward-migration method
    down: function(db, orm, done)
    {
        db.collection('users', function(err, collection) {

            if (err) {
                return done(err);
            }

            collection.dropIndex('email_fullname', done);
        });
    }
}

