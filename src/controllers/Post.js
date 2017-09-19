var Category = require('../models/Category');
var Post = require('../models/Post');
var Tag = require('../models/Tag');

// Get all Categories
exports.getIndex = function (req, res) {
	Post.find({}).populate('category').exec(function (err, posts) {
		if (err) {
			console.log('err', err)
			return done(err);
		}
		
		res.render('post/index', {
			title: 'Tất cả bài viết',
			current: ['post', 'index'],
			posts: posts
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
		
		res.render('post/create', {
			title: 'Viết bài mới',
			current: ['post', 'create'],
			categories: categories
		});
	});
};

exports.postCreate = function (req, res) {
	/*
	* Validate create category
	*/ 
	req.checkBody('title', 'Tiêu đề không được để trống').notEmpty();
	req.checkBody('image', 'Ảnh không được để trống').notEmpty();
	req.checkBody('description', 'Mô tả không được để trống').notEmpty();
	req.checkBody('content', 'Nội dung không được để trống').notEmpty();
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
				res.render('post/create', {
					title: 'Viết bài mới',
					current: ['post', 'create'],
					categories: categories,
					errors: errors,
					data: req.body
				});
			});
		} else {
			var data = req.body;
			var newPost = new Post();
			
			newPost.title = data.title;
			newPost.alias = data.alias;
			newPost.image = data.image;
			newPost.description = data.description;
			newPost.content = data.content;
			newPost.category = data.categoryId ? data.categoryId : null;
			newPost.status = data.status;
			newPost.isHot = data.isHot;
			newPost.seo = {
				metaTitle: data.metaTitle,
				metaDesc: data.metaDesc,
				metaKeywords: data.metaKeywords
			}
			newPost.save(function (err, newPost) {
				if (err) {
					console.log('err', err);
				} else {
					// Save tags
					var tags = data.tags;
					tags = tags.split(',');
		
					for( let i=0; i<tags.length; i++) {
						var tagCheck = tags[i].trim();
						Tag.findOne({tagName: tagCheck}, function(err, tag){
							if (!err) {
								if (tag) {
									// case tag exist
									tag.posts.push(newPost._id);
									tag.save();
									newPost.tags.push(tag._id);
									if ( newPost.tags.length === tags.length ) {
										// Save new post
										newPost.save(function (err) {
											if (err) {
												console.log('err', err);
											} else {
												res.redirect('/post');
											}
										})
									}
								} else {
									// case tag is not exist => create new
									var newTag = new Tag();
									newTag.tagName = tags[i];
									newTag.alias = 'no-alias';
									newTag.posts.push(newPost._id);
									newTag.status = true;
									newTag.save(function(err, newTag) {
										if (err) {
											console.log('err save tag');
										} else {
											newPost.tags.push(newTag._id);
											console.log('newpost.tag', newPost.tags.length);
											console.log('tag', tags.length);
											if ( newPost.tags.length === tags.length ) {
												console.log('ttt');
												// Save new post
												newPost.save(function (err) {
													if (err) {
														console.log('err', err);
													} else {
														res.redirect('/post');
													}
												})
											}
										}
									});
								}
							}
						})
					}
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