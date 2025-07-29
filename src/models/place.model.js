


const mongoose = require('mongoose');


const placeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
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
  openingType: {
    type: String,
    enum: ['open', 'closed'],
  },
  time: {
    open: String,
    close: String,
  },
  price: {
    type: Number,
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
  lastViewedAt: {
    type: Date,
    default: Date.now,
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
}, {
  timestamps: true,
})


/**
 * @typedef Place
 */
const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
