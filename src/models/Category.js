var mongoose = require('mongoose');

/**
 * Category  Mongo DB model
 * @name categoryModel
 */
const categorySchema = new mongoose.Schema({
    categoryName: {type: String},
    alias: {type: String},
    type: Number,
    parentId: mongoose.Schema.ObjectId,
    icon: {type: String},
    status: Boolean,
}, {timestamps: true});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;