const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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
    enum: ['pending', 'resolved'],
    default: 'pending',
  },
  resolvedActions: {
    type: [String],
    enum: ['hide', 'delete', 'ban_user', 'warn_user'],
    default: [],
  },
}, {
  timestamps: true,
});

reportSchema.plugin(toJSON);
reportSchema.plugin(paginate);


/**
 * @typedef Report
 */
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
