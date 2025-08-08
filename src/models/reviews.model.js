const mongoose = require('mongoose');
const { toJSON, paginate, leanToJSON } = require('./plugins');
const { fileSchema } = require('./commonSchemas');

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
  photos: [fileSchema],
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
  isHidden: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);
reviewSchema.plugin(leanToJSON);

module.exports = mongoose.model('Review', reviewSchema);