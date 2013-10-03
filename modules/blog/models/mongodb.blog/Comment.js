/**
 * Comment Model
 */
var crypto = require('crypto');

var Comment = new Schema({

    fullname: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    twitter: {
        type: String,
        required: false
    },

    website: {
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

Comment.virtual('gravatar').get(function() {

    return 'http://www.gravatar.com/avatar/'
        + crypto.createHash('md5').update(this.email).digest("hex")
        + '?s=';
});

Comment.info = {
    singular : 'Comment',
    plural   : 'Comments'
};

module.exports = Comment;

