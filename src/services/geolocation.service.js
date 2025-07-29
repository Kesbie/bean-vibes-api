const { Place } = require('../models');
const pick = require('../utils/pick');

/**
 * Search places by location (nearby places)
 * @param {number} latitude - Latitude of the center point
 * @param {number} longitude - Longitude of the center point
 * @param {number} radius - Search radius in kilometers (default: 5km)
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const searchPlacesByLocation = async (latitude, longitude, radius = 5, options = {}) => {
  const filter = {
    'address.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude], // MongoDB uses [lng, lat] format
        },
        $maxDistance: radius * 1000, // Convert km to meters
      },
    },
    status: 'active',
    approvalStatus: 'approved',
  };

  const result = await Place.paginate(filter, {
    ...options,
    populate: 'categories',
  });

  return result;
};

/**
 * Search places by district
 * @param {string} district - District name
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const searchPlacesByDistrict = async (district, options = {}) => {
  const filter = {
    'address.district': { $regex: district, $options: 'i' },
    status: 'active',
    approvalStatus: 'approved',
  };

  const result = await Place.paginate(filter, {
    ...options,
    populate: 'categories',
  });

  return result;
};

/**
 * Search places by ward
 * @param {string} ward - Ward name
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const searchPlacesByWard = async (ward, options = {}) => {
  const filter = {
    'address.ward': { $regex: ward, $options: 'i' },
    status: 'active',
    approvalStatus: 'approved',
  };

  const result = await Place.paginate(filter, {
    ...options,
    populate: 'categories',
  });

  return result;
};

/**
 * Get places within a bounding box
 * @param {number} minLat - Minimum latitude
 * @param {number} maxLat - Maximum latitude
 * @param {number} minLng - Minimum longitude
 * @param {number} maxLng - Maximum longitude
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getPlacesInBoundingBox = async (minLat, maxLat, minLng, maxLng, options = {}) => {
  const filter = {
    'address.coordinates': {
      $geoWithin: {
        $box: [
          [minLng, minLat], // Bottom left
          [maxLng, maxLat], // Top right
        ],
      },
    },
    status: 'active',
    approvalStatus: 'approved',
  };

  const result = await Place.paginate(filter, {
    ...options,
    populate: 'categories',
  });

  return result;
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} - Distance in kilometers
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Get popular areas (districts with most places)
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
const getPopularAreas = async (options = {}) => {
  const pipeline = [
    {
      $match: {
        status: 'active',
        approvalStatus: 'approved',
        'address.district': { $exists: true, $ne: '' },
      },
    },
    {
      $group: {
        _id: '$address.district',
        count: { $sum: 1 },
        places: { $push: '$$ROOT' },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: options.limit || 10,
    },
  ];

  const result = await Place.aggregate(pipeline);
  return result;
};

/**
 * Validate coordinates
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {boolean} - True if coordinates are valid
 */
const validateCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

/**
 * Generate full address from components
 * @param {Object} addressComponents - Address components
 * @returns {string} - Full address string
 */
const generateFullAddress = (addressComponents) => {
  const parts = [];
  
  if (addressComponents.street) parts.push(addressComponents.street);
  if (addressComponents.ward) parts.push(addressComponents.ward);
  if (addressComponents.district) parts.push(addressComponents.district);
  
  return parts.join(', ');
};

module.exports = {
  searchPlacesByLocation,
  searchPlacesByDistrict,
  searchPlacesByWard,
  getPlacesInBoundingBox,
  calculateDistance,
  getPopularAreas,
  validateCoordinates,
  generateFullAddress,
}; 