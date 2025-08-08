const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { pointSchema, fileSchema, socialSchema } = require('./commonSchemas');
const { default: slugify } = require('slugify');
const { normalizeVietnamese } = require('../utils/nomalizeText');

/** @typedef {import("mongoose").Schema} Schema */

/** @type {Schema} */
const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      trim: true,
    },
    photos: {
      type: [fileSchema],
    },
    menu: {
      type: [fileSchema],
    },
    address: {
      fullAddress: {
        type: String,
        trim: true,
      },
      location: pointSchema
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    wifi: {
      name: String,
      password: String,
    },
    time: {
      open: String,
      close: String,
    },
    price: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
    },
    // phone: {
    //   type: String,
    //   trim: true,
    // },
    socials: [socialSchema],
    isVerified: {
      type: Boolean,
      default: false,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    categories: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'Category',
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    // Hot ranking system
    viewCount: {
      type: Number,
      default: 0,
    },
    hotScore: {
      type: Number,
      default: 0,
    },
    // Trending data (last 7 days)
    weeklyViews: {
      type: Number,
      default: 0,
    },
    weeklyHotScore: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for geospatial queries
// placeSchema.index({ 'address.coordinates': '2dsphere' });
// placeSchema.index({ 'address.district': 1 });
// placeSchema.index({ 'address.ward': 1 });

placeSchema.plugin(toJSON);
placeSchema.plugin(paginate);

placeSchema.statics.isSlugTaken = async function (slug) {
  const place = await this.findOne({ slug }).lean();
  return !!place;
};


placeSchema.pre('save', async function (next) {
  if (!this.slug) {
    const name = normalizeVietnamese(this.name)
    this.slug = slugify(name, { lower: true });

    const isSlugTaken = await Place.isSlugTaken(this.slug);
    if (isSlugTaken) {
      this.slug = `${this.slug}-${slugify(this.address.fullAddress, { lower: true })}-${this.id}`;
    }
  }

  next();
});

/**
 * @typedef Place
 */
const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
