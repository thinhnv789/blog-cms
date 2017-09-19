var express = require('express');
var router = express.Router();
var TagController = require('../controllers/Tag');

/* get all categories. */
router.get('/list', TagController.getList);

module.exports = router;