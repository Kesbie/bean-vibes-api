const mongoose = require('mongoose');


const reportSchema = mongoose.Schema({
  reportable: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    refPath: 'reportableModel'
  },
  reportableModel: {
    type: String,
    required: true,
    enum: ['Review', 'Comment']
  },
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
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});


/**
 * @typedef Report
 */
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
