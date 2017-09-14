var express = require('express');
var router = express.Router();
var PostController = require('../controllers/Post');

/* get all categories. */
router.get('/', PostController.getIndex);
router.get('/create', PostController.getCreate);
router.post('/create', PostController.postCreate);

module.exports = router;
