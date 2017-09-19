var Tag = require('../models/Tag');

// Get all tags
exports.getList = function (req, res) {
  var q = req.query.term;
  q = q.trim();
  // Query like %q%
	Tag.find({tagName: { $regex: '.*' + q + '.*', $options: 'i' }}, {'_id': 0, 'tagName': 1}, function(err, tags) {
    if (err) {
      console.log('err', err);
    } else {
      var result = [];
      tags.map(function(item, index) {
        result.push(item.tagName);
      })
      res.send(result);
    }
  })
};