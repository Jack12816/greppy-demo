/**
 * Post Model
 */
var Post = new Schema({

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],

    views: {
        type: Number,
        default: 1,
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

Post.info = {
    singular : 'Post',
    plural   : 'Posts'
};

module.exports = Post;

