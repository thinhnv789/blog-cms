var mongoose = require('mongoose');

/**
 * Posts  Mongo DB model
 * @name categoryModel
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
        metaKeyWord: {type: String}
    },
    isHot: {type: Boolean},
    status: {type: Boolean},
}, {timestamps: true});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;