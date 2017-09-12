// Upload image
exports.postFroalaUploadImage = (req, res, next) => {
	var FroalaEditor = require('wysiwyg-editor-node-sdk/lib/froalaEditor.js');
	// Store image.
  FroalaEditor.Image.upload(req, '../media/images/', function(err, data) {
    // Return data.
    if (err) {
      return res.send(JSON.stringify(err));
    }
		console.log('data', data);
    res.send(data);
  });
}

// Get all images from folder
exports.getFroalaLoadImages = (req, res, next) => {
	const imageFolder = './media/images/';
	const fs = require('fs');

	let data = [];
	
	fs.readdir(imageFolder, (err, files) => {
		files.forEach(file => {
			data.push({
				url: imageFolder + file,
				thumb: imageFolder + file,
				tag: file
			})
		});
		res.send(data);
	})
}

exports.getUploadImage = (req, res, next) => {
	res.render('media/upload-image', {
		title: 'Media upload image',
		current: ['media', 'upload-image'],
	});
}