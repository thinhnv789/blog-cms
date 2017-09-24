var Category = require('../models/Category');
var Product = require('../models/Product');

// Get all Categories
exports.getIndex = function (req, res) {
	Product.find({}).populate('category').exec(function (err, products) {
		if (err) {
			console.log('err', err)
			return done(err);
		}
		
		res.render('product/index', {
			title: 'Tất cả sản phẩm',
			current: ['product', 'index'],
			products: products
		});
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
		
		res.render('product/create', {
			title: 'Thêm sản phẩm',
			current: ['product', 'create'],
			categories: categories
		});
	});
};

exports.postCreate = function (req, res) {
	/*
	* Validate create category
	*/ 
	req.checkBody('productName', 'Tên sản phẩm không được để trống').notEmpty();
	req.checkBody('image', 'Ảnh không được để trống').notEmpty();
	req.checkBody('description', 'Mô tả không được để trống').notEmpty();
	req.checkBody('productInfo', 'Thông tin không được để trống').notEmpty();
	req.checkBody('categoryId', 'Chọn danh mục cho bài viết').notEmpty();
	
	var errors = req.getValidationResult().then(function(errors) {
		if (!errors.isEmpty()) {
			var errors = errors.mapped();
			Category.find({parent: null}).populate('children').populate({
				path: 'children',
				populate: { path: 'children', model: Category } // <--- specify the model explicitly
			}).exec(function (err, categories) {
				if (err) {
					console.log('err', err)
					return done(err);
				}
				console.log(req.body.categoryId);
				res.render('product/create', {
					title: 'Thêm sản phẩm mới',
					current: ['product', 'create'],
					categories: categories,
					errors: errors,
					data: req.body
				});
			});
		} else {
			var data = req.body;
			var newProduct = new Product();
			
			newProduct.productName = data.productName;
			newProduct.alias = data.alias;
			newProduct.image = data.image;
			newProduct.description = data.description;
			newProduct.productInfo = data.productInfo;
			newProduct.instruction = data.instruction;
      newProduct.category = data.categoryId ? data.categoryId : null;
      newProduct.price = data.price;
      newProduct.oldPrice = data.oldPrice;
      newProduct.isBestSeller = data.isBestSeller;
      newProduct.status = data.status;
      newProduct.madeIn = data.madeIn;
			newProduct.seo = {
				metaTitle: data.metaTitle,
				metaDesc: data.metaDesc,
				metaKeywords: data.metaKeywords
			}
			newProduct.save(function (err) {
				if (err) {
					console.log('err', err);
				} else {
					// Save tags
					res.redirect('/product');
				}
			})
		}
	});
};

// exports.deleteCategory = function (req, res) {
// 	console.log("req", req.body.id);
// 	Category.findByIdAndRemove(req.body.id, function (err, result) {
// 		if (err)
// 			return done(err);
// 		res.redirect('/category/' + 1);
// 	})

// }