const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const commentSchema = mongoose.Schema(
  {
    review: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Review',
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    reactions: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'Reaction',
    },
    reports: {
      type: [mongoose.SchemaTypes.ObjectId],
    }
  },
  {
    timestamps: true,
  },
);

commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

module.exports = mongoose.model('Comment', commentSchema);
