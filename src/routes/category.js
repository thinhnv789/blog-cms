var express = require('express');
var router = express.Router();
var CategoryController = require('../controllers/Category');

/* get all categories. */
router.get('/', CategoryController.getIndex);
router.get('/create', CategoryController.getCreate);
router.post('/create', CategoryController.postCreate);

module.exports = router;
