const mongoose = require('mongoose');


const ratingSchema = mongoose.Schema({
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


/**
 * @typedef Rating
 */
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
