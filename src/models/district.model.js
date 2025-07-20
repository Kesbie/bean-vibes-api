const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const districtSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

districtSchema.plugin(toJSON);
districtSchema.plugin(paginate);

module.exports = mongoose.model('District', districtSchema);
