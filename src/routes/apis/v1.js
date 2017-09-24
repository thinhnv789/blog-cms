var express = require('express');
var router = express.Router();

var ApiPost = require('../../apis/v1/Post');

/* GET home page. */
router.get('/posts', ApiPost.getIndex);

module.exports = router;
