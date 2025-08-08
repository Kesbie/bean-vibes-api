const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  format: {
    type: String,
  },
  width: {
    type: String,
  },
  height: {
    type: String,
  },
  bytes: {
    type: String,
  },
  type: {
    type: String,
  },
  size: {
    type: Number
  }
}, {
  _id: false,
});

module.exports = fileSchema;
