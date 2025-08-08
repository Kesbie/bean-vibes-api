const mongoose = require('mongoose');

const timeSchema = mongoose.Schema({
  open: {
    type: String,
    default: '09:00',
  },
  close: {
    type: String,
    default: '22:00',
  },
}, {
  _id: false,
});

module.exports = timeSchema;