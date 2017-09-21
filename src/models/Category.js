var mongoose = require('mongoose');

/**
 * Category  Mongo DB model
 * @name categoryModel
 */
const categorySchema = new mongoose.Schema({
    categoryName: {type: String},
    alias: {type: String},
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    icon: {type: String},
    status: Boolean,
}, {timestamps: true});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;