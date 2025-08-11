const { Place } = require('../models');
const { NOT_FOUND, FORBIDDEN, BAD_REQUEST } = require('../utils/error.response');
const pick = require('../utils/pick');
const { validatePlaceContent, replaceRestrictedWords } = require('./contentFilter.service');
const {
  trackPlaceView,
  getTrendingPlaces: getTrendingPlacesFromTracking,
  getHotPlacesByCategory: getHotPlacesByCategoryFromTracking,
} = require('./viewTracking.service');
const { categoryService, ratingService } = require('../services');
const reviewService = require('./review.service');

/**
 * Create a place
 * @param {Object} placeBody
 * @returns {Promise<Place>}
 */
const createPlace = async (placeBody) => {
  // Validate content for restricted words
  await validatePlaceContent(placeBody);

  // Process content to replace warn/hide words
  const processedPlaceBody = { ...placeBody };
  if (processedPlaceBody.name) {
    processedPlaceBody.name = await replaceRestrictedWords(processedPlaceBody.name);
  }
  
  if (processedPlaceBody.description) {
    processedPlaceBody.description = await replaceRestrictedWords(processedPlaceBody.description);
  }

  return Place.create(processedPlaceBody);
};

/**
 * Query for places
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPlaces = async (filter, options) => {
  // Handle category filter - convert slugs to ObjectIds
  if (filter.category) {
    const categorySlugs = Array.isArray(filter.category) ? filter.category : [filter.category];
    const categories = await categoryService.getCategoryBySlugs(categorySlugs);
    delete filter.category;
    // Use 'id' field instead of '_id' as aggregation returns 'id'
    filter.categories = { $in: categories.map((category) => category.id || category._id) };
  }

  // Handle name filter - use case-insensitive regex search
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: 'i' };
  }

  // Handle custom sorting for admin users
  if (options.customSort === 'approvalStatus') {
    delete options.customSort;
    const places = await Place.aggregate([
      { $match: filter },
      {
        $addFields: {
          approvalStatusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$approvalStatus', 'pending'] }, then: 1 },
                { case: { $eq: ['$approvalStatus', 'approved'] }, then: 2 },
                { case: { $eq: ['$approvalStatus', 'rejected'] }, then: 3 }
              ],
              default: 4
            }
          }
        }
      },
      { $sort: { approvalStatusOrder: 1, createdAt: -1 } },
      { $skip: (options.page - 1) * (options.limit || 10) },
      { $limit: options.limit || 10 },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories'
        }
      }
    ]);

    // Get total count for pagination
    const totalResults = await Place.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / (options.limit || 10));

    // Add rating details to each place
    if (places && places.length > 0) {
      const placesWithRatings = await Promise.all(
        places.map(async (place) => {
          const ratingDetails = await ratingService.getCriteriaAverages(place._id);
          return {
            ...place,
            ratingDetails,
          };
        }),
      );
      places.splice(0, places.length, ...placesWithRatings);
    }

    return {
      results: places,
      page: options.page || 1,
      limit: options.limit || 10,
      totalPages,
      totalResults,
    };
  }

  const places = await Place.paginate(filter, { ...options, populate: [{ path: 'categories' }] });

  // Add rating details to each place
  if (places.results && places.results.length > 0) {
    const placesWithRatings = await Promise.all(
      places.results.map(async (place) => {
        const ratingDetails = await ratingService.getCriteriaAverages(place._id);
        return {
          ...place.toJSON(),
          ratingDetails,
        };
      }),
    );
    places.results = placesWithRatings;
  }

  return places;
};

/**
 * Get place by id
 * @param {ObjectId} id
 * @param {string} userId - User ID for tracking views
 * @returns {Promise<Place>}
 */
const getPlaceById = async (id, userId = null) => {
  const place = await Place.findById(id)
    .populate('categories', 'name');

  if (place) {
    // Track view (async, don't wait for it)
    trackPlaceView(id, userId).catch(console.error);

    // Get detailed rating information
    const ratingDetails = await ratingService.getCriteriaAverages(id);

    // Add rating details to place object
    const placeWithRatings = place.toObject();
    placeWithRatings.ratingDetails = ratingDetails;

    return placeWithRatings;
  }

  return place;
};

/**
 * Update place by id (with ownership check)
 * @param {ObjectId} placeId
 * @param {Object} updateBody
 * @param {string} userId - User ID for ownership check
 * @param {boolean} isAdmin - Whether user is admin
 * @returns {Promise<Place>}
 */
const updatePlaceById = async (placeId, updateBody, userId = null, isAdmin = false) => {
  const place = await getPlaceById(placeId);
  if (!place) {
    throw new NOT_FOUND('Place not found');
  }

  // Check ownership (admin can update any place, users can only update their own)
  if (!isAdmin && place.createdBy && place.createdBy.toString() !== userId) {
    throw new FORBIDDEN('You can only update your own places');
  }

  // Create merged data for validation
  const mergedData = { ...place.toObject(), ...updateBody };

  // Validate content for restricted words
  await validatePlaceContent(mergedData);

  // Process content to replace warn/hide words
  const processedUpdateBody = { ...updateBody };
  if (processedUpdateBody.name) {
    processedUpdateBody.name = await replaceRestrictedWords(processedUpdateBody.name);
  }
  if (processedUpdateBody.description) {
    processedUpdateBody.description = await replaceRestrictedWords(processedUpdateBody.description);
  }
  if (processedUpdateBody.address) {
    // Handle new address structure
    if (typeof processedUpdateBody.address === 'object') {
      if (processedUpdateBody.address.street) {
        processedUpdateBody.address.street = await replaceRestrictedWords(processedUpdateBody.address.street);
      }
      if (processedUpdateBody.address.ward) {
        processedUpdateBody.address.ward = await replaceRestrictedWords(processedUpdateBody.address.ward);
      }
      if (processedUpdateBody.address.district) {
        processedUpdateBody.address.district = await replaceRestrictedWords(processedUpdateBody.address.district);
      }
      if (processedUpdateBody.address.fullAddress) {
        processedUpdateBody.address.fullAddress = await replaceRestrictedWords(processedUpdateBody.address.fullAddress);
      }
    } else {
      // Handle legacy address format
      processedUpdateBody.address = await replaceRestrictedWords(processedUpdateBody.address);
    }
  }

  Object.assign(place, processedUpdateBody);
  await place.save();
  return place;
};

/**
 * Delete place by id (with ownership check)
 * @param {ObjectId} placeId
 * @param {string} userId - User ID for ownership check
 * @param {boolean} isAdmin - Whether user is admin
 * @returns {Promise<Place>}
 */
const deletePlaceById = async (placeId, userId = null, isAdmin = false) => {
  const place = await getPlaceById(placeId);
  if (!place) {
    throw new NOT_FOUND('Place not found');
  }

  // Check ownership (admin can delete any place, users can only delete their own)
  if (!isAdmin && place.createdBy && place.createdBy.toString() !== userId) {
    throw new FORBIDDEN('You can only delete your own places');
  }

  await Place.findByIdAndDelete(placeId);
  return place;
};

/**
 * Get places by category
 * @param {ObjectId} categoryId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getPlacesByCategory = async (categoryId, options) => {
  const filter = { categories: categoryId, approvalStatus: 'approved' };
  const places = await Place.paginate(filter, options);

  // Add rating details to each place
  if (places.results && places.results.length > 0) {
    const placesWithRatings = await Promise.all(
      places.results.map(async (place) => {
        const ratingDetails = await ratingService.getCriteriaAverages(place._id);
        return {
          ...place.toObject(),
          ratingDetails,
        };
      }),
    );
    places.results = placesWithRatings;
  }

  return places;
};

/**
 * Search places
 * @param {string} searchTerm
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const searchPlaces = async (searchTerm, options) => {
  const filter = {
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { 'address.fullAddress': { $regex: searchTerm, $options: 'i' } },
    ],
    approvalStatus: 'approved',
  };

  const places = await Place.paginate(filter, options);

  // Add rating details to each place
  if (places.results && places.results.length > 0) {
    const placesWithRatings = await Promise.all(
      places.results.map(async (place) => {
        const ratingDetails = await ratingService.getCriteriaAverages(place._id);
        return {
          ...place.toObject(),
          ratingDetails,
        };
      }),
    );
    places.results = placesWithRatings;
  }

  return places;
};

/**
 * Get verified places
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getVerifiedPlaces = async (options) => {
  const filter = { isVerified: true, approvalStatus: 'approved' };
  const places = await Place.paginate(filter, options);

  // Add rating details to each place
  if (places.results && places.results.length > 0) {
    const placesWithRatings = await Promise.all(
      places.results.map(async (place) => {
        const ratingDetails = await ratingService.getCriteriaAverages(place._id);
        return {
          ...place.toObject(),
          ratingDetails,
        };
      }),
    );
    places.results = placesWithRatings;
  }

  return places;
};

/**
 * Update place approval status
 * @param {ObjectId} placeId
 * @param {string} status
 * @param {string} approvedBy - User ID who approved/rejected
 * @returns {Promise<Place>}
 */
const updatePlaceApprovalStatus = async (placeId, status, reason, approvedBy) => {
  const place = await Place.findOne({ _id: placeId });
  if (!place) {
    throw new NOT_FOUND('Place not found');
  }

  place.approvalStatus = status;
  place.approvedBy = approvedBy;
  place.rejectionReason = reason;
  if (status === 'approved') {
    place.isVerified = true;
  }
  await place.save();
  return place;
};

/**
 * Update place rating
 * @param {ObjectId} placeId
 * @param {number} averageRating
 * @param {number} totalRatings
 * @returns {Promise<Place>}
 */
const updatePlaceRating = async (placeId, averageRating, totalRatings) => {
  const place = await getPlaceById(placeId);
  if (!place) {
    throw new NOT_FOUND('Place not found');
  }
  place.averageRating = averageRating;
  place.totalRatings = totalRatings;
  await place.save();
  return place;
};

/**
 * Get trending places
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getTrendingPlaces = async (options) => {
  const trendingPlaces = await getTrendingPlacesFromTracking(options);

  // Add rating details to each place
  if (trendingPlaces.results && trendingPlaces.results.length > 0) {
    const placesWithRatings = await Promise.all(
      trendingPlaces.results.map(async (place) => {
        const ratingDetails = await ratingService.getCriteriaAverages(place._id);
        return {
          ...place.toJSON(),
          ratingDetails,
        };
      }),
    );
    trendingPlaces.results = placesWithRatings;
  }

  return trendingPlaces;
};

/**
 * Get hot places by category
 * @param {ObjectId} categoryId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getHotPlacesByCategory = async (categoryId, options) => {
  const hotPlaces = await getHotPlacesByCategoryFromTracking(categoryId, options);

  // Add rating details to each place
  if (hotPlaces.results && hotPlaces.results.length > 0) {
    const placesWithRatings = await Promise.all(
      hotPlaces.results.map(async (place) => {
        const ratingDetails = await ratingService.getCriteriaAverages(place._id);
        return {
          ...place,
          ratingDetails,
        };
      }),
    );
    hotPlaces.results = placesWithRatings;
  }

  return hotPlaces;
};

/**
 * Get hot places weekly
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getHotPlacesWeekly = async (options) => {
  const filter = { approvalStatus: 'approved' };
  const sortOptions = { ...options, sortBy: 'weeklyHotScore:desc' };
  const places = await Place.paginate(filter, sortOptions);

  // Add rating details to each place
  if (places.results && places.results.length > 0) {
    const placesWithRatings = await Promise.all(
      places.results.map(async (place) => {
        const ratingDetails = await ratingService.getCriteriaAverages(place._id);
        return {
          ...place.toObject(),
          ratingDetails,
        };
      }),
    );
    places.results = placesWithRatings;
  }

  return places;
};

// Public routes
/**
 * Get public place by id (approved places only)
 * @param {ObjectId} id
 * @returns {Promise<Place>}
 */
const getPublicPlaceById = async (id) => {
  const place = await Place.findOne({
    _id: id,
    approvalStatus: 'approved',
  })
    .populate('categories', 'name')
    .lean();

  if (place) {
    // Get detailed rating information
    const ratingDetails = await ratingService.getCriteriaAverages(id);

    // Add rating details to place object
    place.ratingDetails = ratingDetails;
  }

  return place;
};

// User routes
/**
 * Get user places
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} userId - User ID
 * @returns {Promise<QueryResult>}
 */
const getUserPlaces = async (filter, options, userId) => {
  const userFilter = { ...filter, createdBy: userId };
  const places = await Place.paginate(userFilter, options);

  // Add rating details to each place
  if (places.results && places.results.length > 0) {
    const placesWithRatings = await Promise.all(
      places.results.map(async (place) => {
        const ratingDetails = await ratingService.getCriteriaAverages(place._id);
        return {
          ...place.toObject(),
          ratingDetails,
        };
      }),
    );
    places.results = placesWithRatings;
  }

  return places;
};

/**
 * Get my places (places created by the user)
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} userId - User ID
 * @returns {Promise<QueryResult>}
 */
const getMyPlaces = async (filter, options, userId) => {
  const myFilter = { ...filter, createdBy: userId };
  const places = await Place.paginate(myFilter, options);

  // Add rating details to each place
  if (places.results && places.results.length > 0) {
    const placesWithRatings = await Promise.all(
      places.results.map(async (place) => {
        const ratingDetails = await ratingService.getCriteriaAverages(place._id);
        return {
          ...place.toObject(),
          ratingDetails,
        };
      }),
    );
    places.results = placesWithRatings;
  }

  return places;
};

/**
 * Get user place by id (with ownership check)
 * @param {ObjectId} id
 * @param {string} userId - User ID for ownership check
 * @returns {Promise<Place>}
 */
const getUserPlaceById = async (id, userId) => {
  const place = await Place.findOne({
    _id: id,
    createdBy: userId,
  })
    .populate('categories', 'name');

  if (place) {
    // Track view (async, don't wait for it)
    trackPlaceView(id, userId).catch(console.error);

    // Get detailed rating information
    const ratingDetails = await ratingService.getCriteriaAverages(id);

    // Add rating details to place object
    const placeWithRatings = place.toObject();
    placeWithRatings.ratingDetails = ratingDetails;

    return placeWithRatings;
  }

  return place;
};

// Admin routes
/**
 * Get admin places (all places)
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getAdminPlaces = async (filter, options) => {
  // Check if custom sorting is requested
  if (options.customSort && options.customSort.approvalStatus) {
    const { limit = 10, page = 1 } = options;
    
    // Use aggregation pipeline for custom sorting
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          approvalStatusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$approvalStatus', 'pending'] }, then: 1 },
                { case: { $eq: ['$approvalStatus', 'approved'] }, then: 2 },
                { case: { $eq: ['$approvalStatus', 'rejected'] }, then: 3 }
              ],
              default: 4
            }
          }
        }
      },
      { $sort: { approvalStatusOrder: 1, createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories'
        }
      }
    ];

    // Get total count for pagination
    const totalResults = await Place.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    const places = await Place.aggregate(pipeline);

    // Add rating details to each place
    if (places && places.length > 0) {
      const placesWithRatings = await Promise.all(
        places.map(async (place) => {
          const ratingDetails = await ratingService.getCriteriaAverages(place._id);
          return {
            ...place,
            ratingDetails,
          };
        }),
      );
      places.splice(0, places.length, ...placesWithRatings);
    }

    return {
      results: places,
      page,
      limit,
      totalPages,
      totalResults,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  // Use regular pagination if no custom sorting
  const places = await Place.paginate(filter, {
    ...options,
    populate: { path: 'categories' },
  });

  // Add rating details to each place
  if (places.results && places.results.length > 0) {
    const placesWithRatings = await Promise.all(
      places.results.map(async (place) => {
        const ratingDetails = await ratingService.getCriteriaAverages(place._id);
        return {
          ...place.toObject(),
          ratingDetails,
        };
      }),
    );
    places.results = placesWithRatings;
  }

  return places;
};

/**
 * Get admin place by id (all places)
 * @param {ObjectId} id
 * @returns {Promise<Place>}
 */
const getAdminPlaceById = async (id) => {
  const place = await Place.findById(id)
    .populate('categories', 'name')
    .populate('createdBy', 'name email')
    .populate('approvedBy', 'name email');

  if (place) {
    // Get detailed rating information
    const ratingDetails = await ratingService.getCriteriaAverages(id);

    // Add rating details to place object
    const placeWithRatings = place.toObject();
    placeWithRatings.ratingDetails = ratingDetails;

    return placeWithRatings;
  }

  return place;
};

const getPublicPlaceBySlug = async (slug) => {
  const place = await Place.findOne({ slug, approvalStatus: 'approved' })
    .populate('categories', 'name')
    .lean()

  if (!place) {
    throw new NOT_FOUND('Place not found');
  }

  const reviews = await reviewService.getReviewsByPlace(place.id);

  const ratingDetails = await ratingService.getCriteriaAverages(place.id);

  const placeWithRatings = place;
  placeWithRatings.ratingDetails = ratingDetails;
  placeWithRatings.reviews = reviews.results || [];

  return placeWithRatings;
};

const countPlaceByCategory = async (categoryId) => {
  const count = await Place.countDocuments({ categories: categoryId, approvalStatus: 'approved' });
  return count;
};

module.exports = {
  createPlace,
  queryPlaces,
  countPlaceByCategory,
  getPlaceById,
  updatePlaceById,
  deletePlaceById,
  getPlacesByCategory,
  searchPlaces,
  getVerifiedPlaces,
  updatePlaceApprovalStatus,
  updatePlaceRating,
  getTrendingPlaces,
  getHotPlacesByCategory,
  getHotPlacesWeekly,
  getPublicPlaceById,
  getUserPlaces,
  getMyPlaces,
  getUserPlaceById,
  getAdminPlaces,
  getAdminPlaceById,
  getPublicPlaceBySlug,
};
