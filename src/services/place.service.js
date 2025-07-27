const httpStatus = require('http-status');
const { Place } = require('../models');
const ApiError = require('../utils/error.response');
const pick = require('../utils/pick');
const { validatePlaceContent, replaceRestrictedWords } = require('./contentFilter.service');
const { trackPlaceView, getTrendingPlaces: getTrendingPlacesFromTracking, getHotPlacesByCategory: getHotPlacesByCategoryFromTracking } = require('./viewTracking.service');

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
  if (processedPlaceBody.address) {
    // Handle new address structure
    if (typeof processedPlaceBody.address === 'object') {
      if (processedPlaceBody.address.street) {
        processedPlaceBody.address.street = await replaceRestrictedWords(processedPlaceBody.address.street);
      }
      if (processedPlaceBody.address.ward) {
        processedPlaceBody.address.ward = await replaceRestrictedWords(processedPlaceBody.address.ward);
      }
      if (processedPlaceBody.address.district) {
        processedPlaceBody.address.district = await replaceRestrictedWords(processedPlaceBody.address.district);
      }
      if (processedPlaceBody.address.fullAddress) {
        processedPlaceBody.address.fullAddress = await replaceRestrictedWords(processedPlaceBody.address.fullAddress);
      }
    } else {
      // Handle legacy address format
      processedPlaceBody.address = await replaceRestrictedWords(processedPlaceBody.address);
    }
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
  const places = await Place.paginate(filter, options);
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
    .populate('categories', 'name')
    .populate('reviews', 'title content rating');
    
  if (place) {
    // Track view (async, don't wait for it)
    trackPlaceView(id, userId).catch(console.error);
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Place not found');
  }
  
  // Check ownership (admin can update any place, users can only update their own)
  if (!isAdmin && place.createdBy && place.createdBy.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own places');
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Place not found');
  }
  
  // Check ownership (admin can delete any place, users can only delete their own)
  if (!isAdmin && place.createdBy && place.createdBy.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own places');
  }
  
  await place.remove();
  return place;
};

/**
 * Get places by category
 * @param {ObjectId} categoryId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getPlacesByCategory = async (categoryId, options) => {
  const filter = { categories: categoryId, status: 'active' };
  return queryPlaces(filter, options);
};

/**
 * Search places by name or description
 * @param {string} searchTerm
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const searchPlaces = async (searchTerm, options) => {
  const filter = {
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
    ],
    status: 'active',
  };
  return queryPlaces(filter, options);
};

/**
 * Get verified places
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getVerifiedPlaces = async (options) => {
  const filter = { isVerified: true, status: 'active' };
  return queryPlaces(filter, options);
};

/**
 * Update place approval status
 * @param {ObjectId} placeId
 * @param {string} status
 * @param {string} approvedBy - User ID who approved/rejected
 * @returns {Promise<Place>}
 */
const updatePlaceApprovalStatus = async (placeId, status, approvedBy) => {
  const place = await getPlaceById(placeId);
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Place not found');
  }
  place.approvalStatus = status;
  place.approvedBy = approvedBy;
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Place not found');
  }
  place.averageRating = averageRating;
  place.totalRatings = totalRatings;
  await place.save();
  return place;
};

/**
 * Get trending places
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getTrendingPlaces = async (options) => {
  return getTrendingPlacesFromTracking(options);
};

/**
 * Get hot places by category
 * @param {ObjectId} categoryId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getHotPlacesByCategory = async (categoryId, options) => {
  return getHotPlacesByCategoryFromTracking(categoryId, options);
};

/**
 * Get hot places in a week
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getHotPlacesWeekly = async (options) => {
  return getTrendingPlacesFromTracking({ ...options, period: 'weekly' });
};

// Public routes
/**
 * Get public place by id (only approved and active places)
 * @param {ObjectId} id
 * @returns {Promise<Place>}
 */
const getPublicPlaceById = async (id) => {
  const place = await Place.findOne({ 
    _id: id, 
    status: 'active', 
    approvalStatus: 'approved' 
  })
    .populate('categories', 'name')
    .populate('reviews', 'title content rating');
    
  if (place) {
    // Track view (async, don't wait for it)
    trackPlaceView(id, null).catch(console.error);
  }
  
  return place;
};

// User routes
/**
 * Get user places (places that user can see based on their role)
 * @param {Object} filter
 * @param {Object} options
 * @param {string} userId
 * @returns {Promise<QueryResult>}
 */
const getUserPlaces = async (filter, options, userId) => {
  // Users can see their own places and approved places
  const userFilter = {
    $or: [
      { createdBy: userId },
      { status: 'active', approvalStatus: 'approved' }
    ],
    ...filter
  };
  
  const places = await Place.paginate(userFilter, {
    ...options,
    populate: 'categories',
  });
  return places;
};

/**
 * Get my places (places created by the current user)
 * @param {Object} filter
 * @param {Object} options
 * @param {string} userId
 * @returns {Promise<QueryResult>}
 */
const getMyPlaces = async (filter, options, userId) => {
  const myFilter = { createdBy: userId, ...filter };
  
  const places = await Place.paginate(myFilter, {
    ...options,
    populate: 'categories',
  });
  return places;
};

/**
 * Get user place by id (with ownership check)
 * @param {ObjectId} id
 * @param {string} userId
 * @returns {Promise<Place>}
 */
const getUserPlaceById = async (id, userId) => {
  const place = await Place.findOne({
    _id: id,
    $or: [
      { createdBy: userId },
      { status: 'active', approvalStatus: 'approved' }
    ]
  })
    .populate('categories', 'name')
    .populate('reviews', 'title content rating')
    .populate('createdBy', 'name email');
    
  if (place) {
    // Track view (async, don't wait for it)
    trackPlaceView(id, userId).catch(console.error);
  }
  
  return place;
};

// Admin routes
/**
 * Get admin places (all places with admin filters)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getAdminPlaces = async (filter, options) => {
  const places = await Place.paginate(filter, {
    ...options,
    populate: [
      { path: 'categories', select: 'name type slug' },
      { path: 'createdBy', select: 'name email' },
      { path: 'approvedBy', select: 'name email' }
    ],
  });
  return places;
};

/**
 * Get admin place by id (with full details)
 * @param {ObjectId} id
 * @returns {Promise<Place>}
 */
const getAdminPlaceById = async (id) => {
  const place = await Place.findById(id)
    .populate('categories', 'name')
    .populate('reviews', 'title content rating')
    .populate('createdBy', 'name email')
    .populate('approvedBy', 'name email');
  
  return place;
};

module.exports = {
  createPlace,
  queryPlaces,
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
  // Public routes
  getPublicPlaceById,
  // User routes
  getUserPlaces,
  getMyPlaces,
  getUserPlaceById,
  // Admin routes
  getAdminPlaces,
  getAdminPlaceById,
}; 