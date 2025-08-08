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
 * Get detailed rating breakdown for a place with individual criteria averages
 * @param {string} placeId - The place ID
 * @returns {Promise<Object>} Detailed rating breakdown with individual criteria averages
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
      overallAverage: 0,
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

  // Calculate averages for each criteria
  const result = {};
  let totalOverallScore = 0;
  let totalOverallFields = 0;

  Object.keys(breakdown).forEach((field) => {
    const { total, count } = breakdown[field];
    const average = count > 0 ? Math.round((total / count) * 10) / 10 : 0;
    
    result[field] = {
      average,
      count,
    };

    // Add to overall calculation
    if (count > 0) {
      totalOverallScore += total;
      totalOverallFields += count;
    }
  });

  result.totalRatings = ratings.length;
  result.overallAverage = totalOverallFields > 0 ? Math.round((totalOverallScore / totalOverallFields) * 10) / 10 : 0;

  return result;
};

/**
 * Get average ratings for each criteria separately
 * @param {string} placeId - The place ID
 * @returns {Promise<Object>} Individual criteria averages
 */
const getCriteriaAverages = async (placeId) => {
  const ratings = await Rating.find({ place: placeId });
  
  if (ratings.length === 0) {
    return {
      drinkQuality: 0,
      location: 0,
      price: 0,
      service: 0,
      staffAttitude: 0,
      totalRatings: 0,
    };
  }

  const criteriaTotals = {
    drinkQuality: { total: 0, count: 0 },
    location: { total: 0, count: 0 },
    price: { total: 0, count: 0 },
    service: { total: 0, count: 0 },
    staffAttitude: { total: 0, count: 0 },
  };

  // Calculate totals for each criteria
  ratings.forEach((rating) => {
    Object.keys(criteriaTotals).forEach((field) => {
      if (rating[field] !== undefined) {
        criteriaTotals[field].total += rating[field];
        criteriaTotals[field].count += 1;
      }
    });
  });

  // Calculate averages
  const averages = {};
  Object.keys(criteriaTotals).forEach((field) => {
    const { total, count } = criteriaTotals[field];
    averages[field] = count > 0 ? Math.round((total / count) * 10) / 10 : 0;
  });

  averages.totalRatings = ratings.length;

  return averages;
};

module.exports = {
  calculateAndUpdateAverageRating,
  getAverageRating,
  getRatingBreakdown,
  getCriteriaAverages,
}; 