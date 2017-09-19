var mongoose = require('mongoose');

/**
 * Category  Mongo DB model
 * @name tagModel
 */
const tagSchema = new mongoose.Schema({
    tagName: {type: String},
    alias: {type: String},
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    status: Boolean,
}, {timestamps: true});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;