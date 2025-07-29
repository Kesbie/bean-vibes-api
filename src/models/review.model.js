const mongoose = require('mongoose');


const reviewSchema = mongoose.Schema({
  place: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Place',
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  photos: {
    type: Number,
  },
  reactions: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: 'Reaction',
  },
  comments: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: 'Comment',
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  reports: {
    type: [mongoose.SchemaTypes.ObjectId],
  },
}, {
  timestamps: true,
});


/**
 * @typedef Review
 */
const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
