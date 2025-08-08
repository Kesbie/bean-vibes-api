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
    // Cloudinary specific fields
    cloudinaryId: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
    bytes: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

mediaSchema.plugin(toJSON);

module.exports = mongoose.model('Media', mediaSchema);
