const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const wardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    // unique: true,
  },
  district_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },
}, {
  timestamps: true,
});

wardSchema.plugin(toJSON);
wardSchema.plugin(paginate);

module.exports = mongoose.model('Ward', wardSchema);