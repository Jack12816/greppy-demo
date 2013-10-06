/**
 * User Model
 */
var crypto = require('crypto');

var User = new Schema({

    role_id: {
        type: Number,
        default: 1,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    fullname: {
        type: String,
        required: false
    },

    twitter: {
        type: String,
        required: false
    },

    website: {
        type: String,
        required: false
    },

    status: {
        type: String,
        required: false
    },

    created_at: {
        index: true,
        type: Date,
        default: Date.now
    },

    updated_at: {
        index: true,
        type: Date,
        default: null
    },

    deleted_at: {
        index: true,
        type: Date,
        default: null
    }
});

User.virtual('gravatar').get(function() {

    return 'http://www.gravatar.com/avatar/'
        + crypto.createHash('md5').update(this.email).digest("hex")
        + '?s=';
});

User.info = {
    singular : 'User',
    plural   : 'Users'
};

module.exports = User;

