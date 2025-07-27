const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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

reactionSchema.plugin(toJSON);
reactionSchema.plugin(paginate);

module.exports = mongoose.model('Reaction', reactionSchema);