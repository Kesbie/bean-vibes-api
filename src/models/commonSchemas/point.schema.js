const pointSchema = {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number],
    required: true,
  },
};

module.exports = pointSchema;
