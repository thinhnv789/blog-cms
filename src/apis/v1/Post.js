const Post = require('../../models/Post');

// Get all posts
exports.getIndex = function (req, res) {
	Post.find({status: 1}, {
		'_id': 0,
		'title': 1,
		'alias': 1,
		'image': 1,
		'imageUrl': 1,
		'description': 1,
		'category': 1,
		'tags': 1,
		'seo': 1,
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