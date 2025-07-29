const { Place } = require('../models');
const ApiError = require('../utils/error.response');
const httpStatus = require('http-status');

/**
 * Calculate hot score based on views and ratings
 * @param {number} viewCount - Total view count
 * @param {number} averageRating - Average rating
 * @param {number} totalRatings - Total number of ratings
 * @returns {number} - Hot score
 */
const calculateHotScore = (viewCount, averageRating, totalRatings) => {
  // Base score from views (logarithmic to prevent domination by high view counts)
  const viewScore = Math.log10(viewCount + 1) * 10;
  
  // Rating score (weighted by number of ratings)
  const ratingScore = averageRating * Math.min(totalRatings / 10, 1) * 20;
  
  // Total hot score (removed recency factor)
  const hotScore = viewScore + ratingScore;
  
  return Math.round(hotScore * 100) / 100; // Round to 2 decimal places
};

/**
 * Track a view for a place
 * @param {string} placeId - Place ID
 * @param {string} userId - User ID (optional, for future analytics)
 * @returns {Promise<Place>}
 */
const trackPlaceView = async (placeId, userId = null) => {
  const place = await Place.findById(placeId);
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Place not found');
  }

  // Update view count
  place.viewCount += 1;
  
  // Update weekly views (simple implementation - in production you might want a more sophisticated approach)
  place.weeklyViews += 1;
  
  // Recalculate hot score
  place.hotScore = calculateHotScore(
    place.viewCount,
    place.averageRating,
    place.totalRatings
  );
  
  // Calculate weekly hot score
  place.weeklyHotScore = calculateHotScore(
    place.weeklyViews,
    place.averageRating,
    place.totalRatings
  );
  
  await place.save();
  return place;
};

/**
 * Get trending places (sorted by hot score)
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Number of places to return
 * @param {number} [options.page] - Page number
 * @param {string} [options.period] - 'all' or 'weekly'
 * @returns {Promise<Object>}
 */
const getTrendingPlaces = async (options = {}) => {
  const { limit = 10, page = 1, period = 'all' } = options;
  
  const sortField = period === 'weekly' ? 'weeklyHotScore' : 'hotScore';
  
  const result = await Place.paginate(
    { status: 'active', approvalStatus: 'approved' },
    {
      sortBy: `${sortField}:desc`,
      limit: parseInt(limit),
      page: parseInt(page),
      populate: 'categories',
    }
  );
  
  return result;
};

/**
 * Get hot places by category
 * @param {string} categoryId - Category ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const getHotPlacesByCategory = async (categoryId, options = {}) => {
  const { limit = 10, page = 1, period = 'all' } = options;
  
  const sortField = period === 'weekly' ? 'weeklyHotScore' : 'hotScore';
  
  const result = await Place.paginate(
    { 
      categories: categoryId,
      status: 'active', 
      approvalStatus: 'approved' 
    },
    {
      sortBy: `${sortField}:desc`,
      limit: parseInt(limit),
      page: parseInt(page),
      populate: 'categories',
    }
  );
  
  return result;
};

/**
 * Reset weekly stats (should be called by a cron job)
 */
const resetWeeklyStats = async () => {
  await Place.updateMany(
    {},
    {
      weeklyViews: 0,
      weeklyHotScore: 0,
    }
  );
};

/**
 * Update hot scores for all places (should be called periodically)
 */
const updateAllHotScores = async () => {
  const places = await Place.find({});
  
  for (const place of places) {
    place.hotScore = calculateHotScore(
      place.viewCount,
      place.averageRating,
      place.totalRatings
    );
    
    place.weeklyHotScore = calculateHotScore(
      place.weeklyViews,
      place.averageRating,
      place.totalRatings
    );
    
    await place.save();
  }
};

module.exports = {
  trackPlaceView,
  getTrendingPlaces,
  getHotPlacesByCategory,
  resetWeeklyStats,
  updateAllHotScores,
  calculateHotScore,
}; 