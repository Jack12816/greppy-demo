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

    status: {
        type: String,
        required: false
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

