const Rating = require('../models/rating.model');
const Place = require('../models/places.model');

/**
 * Calculate and update average rating for a place
 * @param {string} placeId - The place ID
 * @returns {Promise<Object>} Updated place with new average rating
 */
const calculateAndUpdateAverageRating = async (placeId) => {
  // Get all ratings for the place
  const ratings = await Rating.find({ place: placeId });
  
  if (ratings.length === 0) {
    // No ratings, set average to 0
    await Place.findByIdAndUpdate(placeId, {
      averageRating: 0,
      totalRatings: 0,
    });
    return { averageRating: 0, totalRatings: 0 };
  }

  // Calculate average rating from all rating fields
  let totalScore = 0;
  let totalFields = 0;

  ratings.forEach((rating) => {
    const fields = ['drinkQuality', 'location', 'price', 'service'];
    if (rating.staffAttitude !== undefined) {
      fields.push('staffAttitude');
    }

    fields.forEach((field) => {
      if (rating[field] !== undefined) {
        totalScore += rating[field];
        totalFields += 1;
      }
    });
  });

  const averageRating = totalFields > 0 ? totalScore / totalFields : 0;
  const roundedAverage = Math.round(averageRating * 10) / 10; // Round to 1 decimal place

  // Update place with new average rating
  await Place.findByIdAndUpdate(placeId, {
    averageRating: roundedAverage,
    totalRatings: ratings.length,
  });

  return {
    averageRating: roundedAverage,
    totalRatings: ratings.length,
  };
};

/**
 * Get average rating for a place
 * @param {string} placeId - The place ID
 * @returns {Promise<Object>} Average rating information
 */
const getAverageRating = async (placeId) => {
  const place = await Place.findById(placeId).select('averageRating totalRatings');
  return {
    averageRating: place?.averageRating || 0,
    totalRatings: place?.totalRatings || 0,
  };
};

/**
 * Get detailed rating breakdown for a place
 * @param {string} placeId - The place ID
 * @returns {Promise<Object>} Detailed rating breakdown
 */
const getRatingBreakdown = async (placeId) => {
  const ratings = await Rating.find({ place: placeId });
  
  if (ratings.length === 0) {
    return {
      drinkQuality: { average: 0, count: 0 },
      location: { average: 0, count: 0 },
      price: { average: 0, count: 0 },
      service: { average: 0, count: 0 },
      staffAttitude: { average: 0, count: 0 },
      totalRatings: 0,
    };
  }

  const breakdown = {
    drinkQuality: { total: 0, count: 0 },
    location: { total: 0, count: 0 },
    price: { total: 0, count: 0 },
    service: { total: 0, count: 0 },
    staffAttitude: { total: 0, count: 0 },
  };

  ratings.forEach((rating) => {
    Object.keys(breakdown).forEach((field) => {
      if (rating[field] !== undefined) {
        breakdown[field].total += rating[field];
        breakdown[field].count += 1;
      }
    });
  });

  // Calculate averages
  const result = {};
  Object.keys(breakdown).forEach((field) => {
    const { total, count } = breakdown[field];
    result[field] = {
      average: count > 0 ? Math.round((total / count) * 10) / 10 : 0,
      count,
    };
  });

  result.totalRatings = ratings.length;
  return result;
};

module.exports = {
  calculateAndUpdateAverageRating,
  getAverageRating,
  getRatingBreakdown,
}; 