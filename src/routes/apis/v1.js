var express = require('express');
var router = express.Router();

var ApiPost = require('../../apis/v1/Post');
var ApiSlider = require('../../apis/v1/Slider');
var ApiProduct = require('../../apis/v1/Product');

/* GET home page. */
router.get('/posts', ApiPost.getIndex);

/* GET product. */
router.get('/products', ApiProduct.getIndex);

/**
 * All api slider
 */
router.get('/sliders', ApiSlider.getIndex);

module.exports = router;
