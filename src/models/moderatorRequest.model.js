const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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
  reviewedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});



// Index for better query performance
moderatorRequestSchema.index({ user: 1, status: 1 });
moderatorRequestSchema.index({ status: 1, createdAt: -1 });
moderatorRequestSchema.index({ reviewedBy: 1 });

// Virtual for checking if request is active
moderatorRequestSchema.virtual('isActive').get(function() {
  return this.status === 'pending';
});

// Virtual for checking if user can submit new request
moderatorRequestSchema.virtual('canSubmitNew').get(function() {
  return this.status === 'rejected' || this.status === 'approved';
});

moderatorRequestSchema.plugin(toJSON);
moderatorRequestSchema.plugin(paginate);

module.exports = mongoose.model('ModeratorRequest', moderatorRequestSchema); 