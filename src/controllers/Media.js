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

exports.postUploadImage = (req, res, next) => {
	var fs = require('fs'),
	path = require('path');
	formidable = require('formidable'),
	readChunk = require('read-chunk'),
	fileType = require('file-type'),
	form = new formidable.IncomingForm(),
	uploadDir = '/media/',
	prefixFileName = 'image';

	form.multiples = true;

	form.on('field', function(name, value) {
		switch (name) {
			case 'uploadDir':
				uploadDir = value;
				break;
			case 'prefixFileName':
				prefixFileName = value;
			default:
				break;
		}
	});

	// Invoked when a file has finished uploading.
	form.on('file', function (name, file) {
		var buffer = null,
				type = null,
				filename = '';

		// Read a chunk of the file.
		buffer = readChunk.sync(file.path, 0, 262);
		// Get the file type using the buffer read using read-chunk
		type = fileType(buffer);

		// Check the file type, must be either png,jpg or jpeg
		if (type !== null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'jpeg')) {
				// Assign new file name
				filename = prefixFileName + '-' + Date.now() + '.' + type.ext;
				// Move the file with the new file name
				fs.rename(file.path, path.join(__dirname, '/../..' + uploadDir + filename));
				// Response 
				res.status(200).end(JSON.stringify({
					path: uploadDir + filename,
					fileName: filename
				}));
		}
	});

	// once all the files have been uploaded, send a response to the client
  // form.on('end', function(e) {
  //   res.end('success', e);
  // });

	// Parse the incoming form fields.
	form.parse(req);
}