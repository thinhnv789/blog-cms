const Slider = require('../../models/Slider');

// Get all active sliders
exports.getIndex = function (req, res) {
	Slider.find({status: 1}, {
		'_id': 0,
		'name': 1,
    'link': 1,
    'image': 1,
		'image_thumb': 1,
		'image_origin': 1,
	}).exec(function (err, sliders) {
		if (err) {
			console.log('err', err)
			return done(err);
		}
		res.send({
			code: 0,
			data: sliders
		});
	});
};