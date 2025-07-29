const mongoose = require('mongoose');


const reactionSchema = mongoose.Schema({
  review: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Review',
  },
  comment: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Comment',
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  type: {
    type: String,
    enum: ['like', 'dislike'],
  },
}, {
  timestamps: true,
});


/**
 * @typedef Reaction
 */
const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;
