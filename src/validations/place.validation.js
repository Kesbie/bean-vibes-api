const Joi = require('joi');
const { objectId, file } = require('./custom.validation');

const createPlace = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1).max(200),
    description: Joi.string().max(2000),
    photos: Joi.array().items(Joi.object().keys().custom(file)),
    menu: Joi.array().items(Joi.object().keys().custom(file)),
    address: Joi.object().keys({
      fullAddress: Joi.string().max(500),
      location: Joi.object().optional().keys({
        coordinates: Joi.array().items(Joi.number()),
      }),
    }),
    status: Joi.string().valid('active', 'inactive'),
    wifi: Joi.object().keys({
      name: Joi.string().max(100),
      password: Joi.string().max(100),
    }),
    time: Joi.object().keys({
      open: Joi.string().max(10),
      close: Joi.string().max(10),
    }),
    price: Joi.object().keys({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
    }),
    socials: Joi.array().items(Joi.object().keys({
      type: Joi.string().max(100),
      url: Joi.string().uri(),
    })),
    categories: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

const getPlaces = {
  query: Joi.object().keys({
    name: Joi.string(),
    category: Joi.alternatives().try(
      Joi.string().description('Single category slug or comma-separated list'),
      Joi.array().items(Joi.string()).description('Array of category slugs')
    ),
    categories: Joi.alternatives().try(
      Joi.string().description('Single category slug or comma-separated list'),
      Joi.array().items(Joi.string()).description('Array of category slugs')
    ),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
};

const updatePlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().min(1).max(200),
      description: Joi.string().max(2000),
      photos: Joi.array().items(Joi.object().keys().custom(file)),
      menu: Joi.array().items(Joi.object().keys().custom(file)),
      address: Joi.object().keys({
        fullAddress: Joi.string().max(500),
        location: Joi.object().optional().keys({
          coordinates: Joi.array().items(Joi.number()),
        }),
      }),
      status: Joi.string().valid('active', 'inactive'),
      wifi: Joi.object().keys({
        name: Joi.string().max(100),
        password: Joi.string().max(100),
      }),
      time: Joi.object().keys({
        open: Joi.string().max(10),
        close: Joi.string().max(10),
      }),
      price: Joi.object().keys({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
      }),
      socials: Joi.array().items(Joi.string().uri()),
      categories: Joi.array().items(Joi.string().custom(objectId)),
    })
    .min(1),
};

const deletePlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
};

const searchPlaces = {
  query: Joi.object().keys({
    q: Joi.string().required().min(1),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPlacesByCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getVerifiedPlaces = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updatePlaceApprovalStatus = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected').required(),
    reason: Joi.string().optional().max(2000),
  }),
};

const updatePlaceRating = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    averageRating: Joi.number().min(0).max(5).required(),
    totalRatings: Joi.number().min(0).required(),
  }),
};

const checkPlaceContent = {
  body: Joi.object().keys({
    name: Joi.string().max(200),
    description: Joi.string().max(2000),
    address: Joi.object().keys({
      street: Joi.string().max(200),
      ward: Joi.string().max(100),
      district: Joi.string().max(100),
      fullAddress: Joi.string().max(500),
      coordinates: Joi.object().keys({
        latitude: Joi.number().min(-90).max(90),
        longitude: Joi.number().min(-180).max(180),
      }),
    }),
  }),
};

const getTrendingPlaces = {
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
    period: Joi.string().valid('all', 'weekly'),
  }),
};

const getHotPlacesByCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
    period: Joi.string().valid('all', 'weekly'),
  }),
};

const getHotPlacesWeekly = {
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
  }),
};

// Public routes validation
const getPublicPlaces = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
    category: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
    name: Joi.string(),
  }),
};

const getPublicPlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
};

const getPublicPlaceBySlug = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

// User routes validation
const getUserPlaces = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
    status: Joi.string().valid('active', 'inactive'),
    approvalStatus: Joi.string().valid('pending', 'approved', 'rejected'),
  }),
};

const getMyPlaces = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
    status: Joi.string().valid('active', 'inactive'),
    approvalStatus: Joi.string().valid('pending', 'approved', 'rejected'),
  }),
};

const getUserPlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
};

// Admin routes validation
const getAdminPlaces = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
    status: Joi.string().valid('active', 'inactive'),
    approvalStatus: Joi.string().valid('pending', 'approved', 'rejected'),
    isVerified: Joi.boolean(),
    createdBy: Joi.string().custom(objectId),
  }),
};

const getPendingPlaces = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
  }),
};

const getAdminPlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createPlace,
  getPlaces,
  getPlace,
  updatePlace,
  deletePlace,
  searchPlaces,
  getPlacesByCategory,
  getVerifiedPlaces,
  updatePlaceApprovalStatus,
  updatePlaceRating,
  checkPlaceContent,
  getTrendingPlaces,
  getHotPlacesByCategory,
  getHotPlacesWeekly,
  // Public routes
  getPublicPlaces,
  getPublicPlace,
  // User routes
  getUserPlaces,
  getMyPlaces,
  getUserPlace,
  // Admin routes
  getAdminPlaces,
  getPendingPlaces,
  getAdminPlace,
  getPublicPlaceBySlug,
}; 