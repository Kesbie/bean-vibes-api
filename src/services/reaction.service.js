const httpStatus = require('http-status');
const { Reaction } = require('../models');
const ApiError = require('../utils/error.response');
const pick = require('../utils/pick');

/**
 * Create a reaction
 * @param {Object} reactionBody
 * @returns {Promise<Reaction>}
 */
const createReaction = async (reactionBody) => {
  return Reaction.create(reactionBody);
};

/**
 * Query for reactions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReactions = async (filter, options) => {
  const reactions = await Reaction.paginate(filter, options);
  return reactions;
};

/**
 * Get reaction by id
 * @param {ObjectId} id
 * @returns {Promise<Reaction>}
 */
const getReactionById = async (id) => {
  return Reaction.findById(id)
    .populate('user', 'name email')
    .populate('review', 'title content')
    .populate('comment', 'content');
};

/**
 * Update reaction by id
 * @param {ObjectId} reactionId
 * @param {Object} updateBody
 * @returns {Promise<Reaction>}
 */
const updateReactionById = async (reactionId, updateBody) => {
  const reaction = await getReactionById(reactionId);
  if (!reaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reaction not found');
  }
  Object.assign(reaction, updateBody);
  await reaction.save();
  return reaction;
};

/**
 * Delete reaction by id
 * @param {ObjectId} reactionId
 * @returns {Promise<Reaction>}
 */
const deleteReactionById = async (reactionId) => {
  const reaction = await getReactionById(reactionId);
  if (!reaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reaction not found');
  }
  await Reaction.findByIdAndDelete(reactionId);
  return reaction;
};

/**
 * Get reactions by user
 * @param {ObjectId} userId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getReactionsByUser = async (userId, options) => {
  const filter = { user: userId };
  return queryReactions(filter, options);
};

/**
 * Get reactions by review
 * @param {ObjectId} reviewId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getReactionsByReview = async (reviewId, options) => {
  const filter = { review: reviewId };
  return queryReactions(filter, options);
};

/**
 * Get reactions by comment
 * @param {ObjectId} commentId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getReactionsByComment = async (commentId, options) => {
  const filter = { comment: commentId };
  return queryReactions(filter, options);
};

/**
 * Get reactions by type
 * @param {string} type
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getReactionsByType = async (type, options) => {
  const filter = { type };
  return queryReactions(filter, options);
};

/**
 * Toggle reaction (like/dislike)
 * @param {ObjectId} userId
 * @param {ObjectId} reviewId
 * @param {ObjectId} commentId
 * @param {string} type
 * @returns {Promise<Reaction>}
 */
const toggleReaction = async (userId, reviewId = null, commentId = null, type) => {
  const filter = { user: userId, type };
  if (reviewId) filter.review = reviewId;
  if (commentId) filter.comment = commentId;

  const existingReaction = await Reaction.findOne(filter);
  
  if (existingReaction) {
    // Remove existing reaction
    await Reaction.findByIdAndDelete(existingReaction._id);
    return null;
  } else {
    // Create new reaction
    const reactionBody = { user: userId, type };
    if (reviewId) reactionBody.review = reviewId;
    if (commentId) reactionBody.comment = commentId;
    return createReaction(reactionBody);
  }
};

/**
 * Get reaction count by type
 * @param {ObjectId} reviewId
 * @param {ObjectId} commentId
 * @param {string} type
 * @returns {Promise<number>}
 */
const getReactionCount = async (reviewId = null, commentId = null, type) => {
  const filter = { type };
  if (reviewId) filter.review = reviewId;
  if (commentId) filter.comment = commentId;
  
  return Reaction.countDocuments(filter);
};

module.exports = {
  createReaction,
  queryReactions,
  getReactionById,
  updateReactionById,
  deleteReactionById,
  getReactionsByUser,
  getReactionsByReview,
  getReactionsByComment,
  getReactionsByType,
  toggleReaction,
  getReactionCount,
}; 