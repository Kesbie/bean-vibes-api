const mongoose = require('mongoose');

const socialSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ['facebook', 'youtube', 'instagram', 'tiktok', 'twitter'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
}, {
  _id: false,
});

module.exports = socialSchema;