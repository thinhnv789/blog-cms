var mongoose = require('mongoose');

/**
 * Posts  Mongo DB model
 * @name postModel
 */
const postSchema = new mongoose.Schema({
    title: {type: String},
    alias: {type: String},
    image: {type: String},
    description: {type: String},
    content: {type: String},
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    publishTime: {type: Date},
    seo: {
        metaTitle: {type: String},
        metaDesc: {type: String},
        metaKeyWords: {type: String}
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    isHot: {type: Boolean},
    status: {type: Boolean},
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;