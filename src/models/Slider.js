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
sliderSchema.virtual('thumbnail').get(function () {
  return systemConfig.mediaUrl + '/images/slider/thumb/' + this.image;
});

sliderSchema.virtual('original').get(function () {
  return systemConfig.mediaUrl + '/images/slider/thumb/' + this.image;
});

sliderSchema.virtual('originalAlt').get(function () {
  return this.name;
});

const Slider = mongoose.model('Slider', sliderSchema);

module.exports = Slider;