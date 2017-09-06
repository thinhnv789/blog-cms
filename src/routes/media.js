var express = require('express');
var router = express.Router();
var MediaController = require('../controllers/Media');

/* Post Upload Image. */
router.post('/upload_image', MediaController.postUploadImage);
router.get('/load_images', MediaController.getLoadImages);

module.exports = router;
