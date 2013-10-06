/**
 * Comment Model
 */
var crypto = require('crypto');

var Comment = new Schema({

    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    fullname: {
        type: String,
        required: false
    },

    email: {
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

Comment.virtual('gravatar').get(function() {

    return 'http://www.gravatar.com/avatar/'
        + crypto.createHash('md5').update(this.email).digest("hex")
        + '?s=';
});

Comment.virtual('slug').get(function() {

    return (this.id + '-' + this.title.replace(/[^a-z0-9]/gi, '-')).toLowerCase();
});

Comment.info = {
    singular : 'Comment',
    plural   : 'Comments'
};

module.exports = Comment;

