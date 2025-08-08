const mongoose = require('mongoose');


const commentSchema = mongoose.Schema(
  {
    review: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'review',
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
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
    },
    isHidden: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  },
);


/**
 * @typedef Comment
 */
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
