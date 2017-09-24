var express = require('express');
var router = express.Router();
var ProductController = require('../controllers/Product');

/* get all categories. */
router.get('/', ProductController.getIndex);
router.get('/create', ProductController.getCreate);
router.post('/create', ProductController.postCreate);

module.exports = router;
