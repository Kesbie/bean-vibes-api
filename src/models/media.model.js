const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

mediaSchema.plugin(toJSON);

module.exports = mongoose.model('Media', mediaSchema);
