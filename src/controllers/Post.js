var Category = require('../models/Category');

// Get all Categories
exports.getIndex = function (req, res) {
	res.render('post/index', {
    title: 'Tất cả bài viết',
    current: ['post', 'index']
  });
};

exports.getCreate = function (req, res) {
	Category.find({parent: null}).populate('children').populate({
		path: 'children',
		populate: { path: 'children', model: Category } // <--- specify the model explicitly
	}).exec(function (err, categories) {
		if (err) {
			console.log('err', err)
			return done(err);
		}
		
		res.render('post/create', {
			title: 'Viết bài mới',
			current: ['post', 'create'],
			categories: categories
		});
	});
};

exports.postCreate = function (req, res) {
	res.redirect('/post');
};

// exports.deleteCategory = function (req, res) {
// 	console.log("req", req.body.id);
// 	Category.findByIdAndRemove(req.body.id, function (err, result) {
// 		if (err)
// 			return done(err);
// 		res.redirect('/category/' + 1);
// 	})

// }