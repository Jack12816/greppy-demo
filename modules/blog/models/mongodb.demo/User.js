/**
 * User model
 */

var User = new Schema({

    role_id: {
        type: Number,
        default: 1
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
        type: Date,
        default: null
    }
});

module.exports = User;

