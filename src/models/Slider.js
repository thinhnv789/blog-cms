var mongoose = require('mongoose');
const systemConfig = require('./../config/system.json');

/**
 * Role  Mongo DB model
 * @name sliderModel
 */
const sliderSchema = new mongoose.Schema({
    name: {type: String},
    image: {type: String},
    link: {type: String},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: Boolean,
}, {timestamps: true});

sliderSchema.set('toJSON', {
  virtuals: true
});
// Get full image url with media config
sliderSchema.virtual('image_thumb').get(function () {
  return systemConfig.mediaUrl + '/images/slider/thumb/' + this.image;
});

sliderSchema.virtual('image_origin').get(function () {
  return systemConfig.mediaUrl + '/images/slider/origin/' + this.image;
});

const Slider = mongoose.model('Slider', sliderSchema);

module.exports = Slider;