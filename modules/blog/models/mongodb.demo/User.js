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
        type: String
    },

    password: {
        type: String
    },

    deleted_at: {
        type: Date
    }
});

module.exports = User;

