const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const District = require('./district.model');
const Ward = require('./ward.model');

const addressSchema = mongoose.Schema(
  {
    place_id: {
      type: String,
      required: true,
      unique: true,
    },
    district_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: true,
    },
    ward_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ward',
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    addressText: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

addressSchema.plugin(toJSON);
addressSchema.plugin(paginate);

addressSchema.pre('save', async function (next) {
  const district = await District.findById(this.district_id);
  const ward = await Ward.findById(this.ward_id);
  this.addressText = `${this.detail}, ${ward.name}, ${district.name}`;
  next();
});

module.exports = mongoose.model('Address', addressSchema);
