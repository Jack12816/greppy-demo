/**
 * User Model
 */
var User = new Schema({

    role_id: {
        type: Number,
        default: 1,
        required: true
    },

    fullname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: null
    },

    deleted_at: {
        type: Date,
        default: null
    }
});

User.info = {
    singular : 'User',
    plural   : 'Users'
};

module.exports = User;

