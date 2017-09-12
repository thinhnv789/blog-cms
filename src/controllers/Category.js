var Category = require('../models/Category');

// Get all Categories
exports.getIndex = function (req, res) {
	Category.find({parent: null}).populate('children').populate({
		path: 'children',
		populate: { path: 'children', model: Category } // <--- specify the model explicitly
	}).exec(function (err, categories) {
		if (err) {
			console.log('err', err)
			return done(err);
		}
		
		res.render('category/index', {
			title: 'Tất cả danh mục',
			current: ['category', 'index'],
			categories: categories
		});
	});
};

exports.getCreate = function (req, res) {
	Category.find({parent: null}).populate('children').populate({
		path: 'children',
		populate: { path: 'children', model: Category } // <--- specify the model explicitly
	}).exec(function (err, parents) {
		if (err) {
			console.log('err', err)
			return done(err);
		}

		console.log(parents[0].children[0].children[0])
		
		res.render('category/create', {
			title: 'Create New Category',
			current: ['category', 'create'],
			parents: parents
		});
	});
	// res.render('category/create', {
	//     title: 'Create New Category'
	// });
};

exports.postCreate = function (req, res) {
	var newCategory = new Category();
	var mongoose = require('mongoose');

	newCategory.categoryName = req.body.categoryName;
	newCategory.alias = req.body.alias;
	newCategory.icon = '';
	newCategory.parent = req.body.parentId ? req.body.parentId : null;
	newCategory.status = req.body.status;
	// save the user
	newCategory.save(function (err) {
		if (err) {
			console.log('Error in Saving: ' + err);
			res.send({ "result": false });
		}
		// Insert child to category
		if (newCategory.parent) {
			Category.findOne({ _id: newCategory.parent }, function (err, cat) {
				if (!err) {
					cat.children.push(newCategory._id);
					cat.save(function (er) {
						if (err) {
							console.log('Error in Saving children: ' + err);
							res.send({ "result": false });
						} else {
							res.redirect('/category');
						}	
					})
				}
			})
		} else {
			res.redirect('/category');
		}
		//res.redirect('/category/' + newCategory.type);
	});
};

exports.deleteCategory = function (req, res) {
	console.log("req", req.body.id);
	Category.findByIdAndRemove(req.body.id, function (err, result) {
		if (err)
			return done(err);
		res.redirect('/category/' + 1);
	})

}