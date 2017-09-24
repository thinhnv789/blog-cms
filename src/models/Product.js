var mongoose = require('mongoose');

/**
 * Product  Mongo DB model
 * @name productModel
 */
const productSchema = new mongoose.Schema({
	productName: {type: String},
	alias: {type: String},
	image: {type: String},
	description: {type: String},
	productInfo: {type: String},
	instruction: {type: String},
	category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
	price: {type: Number},
	oldPrice: {type: Number},
	isBestSeller: {type: Boolean},
	status: {type: Boolean},
	madeIn: {type: String},
	seo: {
			metaTitle: {type: String},
			metaDesc: {type: String},
			metaKeyWords: {type: String}
	},
	publishTime: {type: Date},
	createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;