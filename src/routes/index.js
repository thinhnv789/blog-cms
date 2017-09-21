var express = require('express');
var router = express.Router();

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('../config/passport');

/* GET home page. */
router.get('/', passportConfig.isAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
