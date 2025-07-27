const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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

ratingSchema.plugin(toJSON);
ratingSchema.plugin(paginate);

module.exports = mongoose.model('Rating', ratingSchema);
