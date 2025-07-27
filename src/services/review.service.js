const httpStatus = require('http-status');
const { Review } = require('../models');
const ApiError = require('../utils/error.response');
const pick = require('../utils/pick');

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (reviewBody) => {
  return Review.create(reviewBody);
};

/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter, options) => {
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

/**
 * Get review by id
 * @param {ObjectId} id
 * @returns {Promise<Review>}
 */
const getReviewById = async (id) => {
  return Review.findById(id)
    .populate('user', 'name email')
    .populate('place', 'name')
    .populate('reactions', 'type user')
    .populate('comments', 'content user');
};

/**
 * Update review by id
 * @param {ObjectId} reviewId
 * @param {Object} updateBody
 * @returns {Promise<Review>}
 */
const updateReviewById = async (reviewId, updateBody) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  Object.assign(review, updateBody);
  await review.save();
  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<Review>}
 */
const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  await review.remove();
  return review;
};

/**
 * Get reviews by place
 * @param {ObjectId} placeId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getReviewsByPlace = async (placeId, options) => {
  const filter = { place: placeId };
  return queryReviews(filter, options);
};

/**
 * Get reviews by user
 * @param {ObjectId} userId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getReviewsByUser = async (userId, options) => {
  const filter = { user: userId };
  return queryReviews(filter, options);
};

/**
 * Search reviews by title or content
 * @param {string} searchTerm
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const searchReviews = async (searchTerm, options) => {
  const filter = {
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { content: { $regex: searchTerm, $options: 'i' } },
    ],
  };
  return queryReviews(filter, options);
};

/**
 * Get anonymous reviews
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getAnonymousReviews = async (options) => {
  const filter = { isAnonymous: true };
  return queryReviews(filter, options);
};

/**
 * Add reaction to review
 * @param {ObjectId} reviewId
 * @param {ObjectId} reactionId
 * @returns {Promise<Review>}
 */
const addReactionToReview = async (reviewId, reactionId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  if (!review.reactions.includes(reactionId)) {
    review.reactions.push(reactionId);
    await review.save();
  }
  return review;
};

/**
 * Remove reaction from review
 * @param {ObjectId} reviewId
 * @param {ObjectId} reactionId
 * @returns {Promise<Review>}
 */
const removeReactionFromReview = async (reviewId, reactionId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  review.reactions = review.reactions.filter(id => id.toString() !== reactionId.toString());
  await review.save();
  return review;
};

/**
 * Add comment to review
 * @param {ObjectId} reviewId
 * @param {Object} commentData
 * @returns {Promise<Comment>}
 */
const addCommentToReview = async (reviewId, commentData) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  const { Comment } = require('../models');
  const comment = await Comment.create({
    ...commentData,
    review: reviewId,
  });
  
  // Add comment to review's comments array
  review.comments.push(comment._id);
  await review.save();
  
  return comment;
};

module.exports = {
  createReview,
  queryReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
  getReviewsByPlace,
  getReviewsByUser,
  searchReviews,
  getAnonymousReviews,
  addReactionToReview,
  removeReactionFromReview,
  addCommentToReview,
}; 