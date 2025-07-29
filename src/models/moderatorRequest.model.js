const mongoose = require('mongoose');


const moderatorRequestSchema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  reviewedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },

}, {
  timestamps: true,
});


/**
 * @typedef ModeratorRequest
 */
const ModeratorRequest = mongoose.model('ModeratorRequest', moderatorRequestSchema);

module.exports = ModeratorRequest;
