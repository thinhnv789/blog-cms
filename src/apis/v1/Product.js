const Post = require('../../models/Product');

// Get all posts
exports.getIndex = function (req, res) {
	Post.find({status: 1}, {
		'_id': 1,
		'productName': 1,
		'alias': 1,
		'image': 1,
		'imageUrl': 1,
		'description': 1,
		'productInfo': 1,
		'instruction': 1,
		'seo': 1,
		'category':1,
		'price':1,
		'oldPrice':1,
		'isBestSeller':1,
		'status':1,
		'madeIn':1,
		'createdBy':1,
		'publishTime': 1
	})
	.populate('category', {
		'_id': 0,
		'categoryName': 1,
		'alias': 1
	})
	.populate('tags', {
		'_id': 0,
		'tagName': 1,
		'alias': 1
	}).exec(function (err, posts) {
		if (err) {
			console.log('err', err)
			return done(err);
		}
		res.send({
			code: 0,
			data: posts
		});
	});
};