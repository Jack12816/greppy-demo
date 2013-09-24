/**
 * User model
 */

var User = new Schema({

    role_id: {
        type: Number
    },

    fullname: {
        type: String
    },

    email: {
        type: String,
        index: true
    },

    password: {
        type: String
    },

    deleted_at: {
        type: Date
    }
});

module.exports = User;

