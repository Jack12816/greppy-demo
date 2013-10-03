/**
 * Comments Migration
 */
module.exports = {

    // Forward-migration method
    up: function(db, orm, done)
    {
        db.collection('comments', function(err, collection) {

            if (err) {
                return done(err);
            }

            // Do some special stuff
            done();
        });
    },

    // Backward-migration method
    down: function(db, orm, done)
    {
        db.collection('comments', function(err, collection) {

            if (err) {
                return done(err);
            }

            // Do some special stuff
            done();
        });
    }
}

