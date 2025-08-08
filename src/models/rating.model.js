const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ratingSchema = new mongoose.Schema({
  place: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Place',
  },
  drinkQuality: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  location: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  service: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  staffAttitude: {
    type: Number,
    min: 0,
    max: 5,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
  },
}, {
  timestamps: true,
});

ratingSchema.plugin(toJSON);
ratingSchema.plugin(paginate);

/**
 * @typedef Rating
 */
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
