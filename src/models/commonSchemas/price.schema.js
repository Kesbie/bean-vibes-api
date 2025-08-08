const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
  min: {
    type: Number,
    default: 20000,
  },
  max: {
    type: Number,
    default: 50000,
  },
}, {
  _id: false,
});

module.exports = priceSchema;