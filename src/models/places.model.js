const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

/** @typedef {import("mongoose").Schema} Schema */

/** @type {Schema} */
const placeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  photos: {
    type: [String],
  },
  address: {
    street: {
      type: String,
      trim: true,
    },
    ward: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    fullAddress: {
      type: String,
      trim: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude] - GeoJSON format
        required: true,
      },
    },
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
  socials: [{
    type: {
      type: String,
      enum: ['facebook', 'youtube', 'instagram', 'tiktok', 'twitter'],
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
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
    ref: 'Category'
  },
  reviews: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: 'Review'
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
}, {
  timestamps: true,
});

// Index for geospatial queries
placeSchema.index({ 'address.coordinates': '2dsphere' });
placeSchema.index({ 'address.district': 1 });
placeSchema.index({ 'address.ward': 1 });

placeSchema.plugin(toJSON);
placeSchema.plugin(paginate);


/**
 * @typedef Place
 */
const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
