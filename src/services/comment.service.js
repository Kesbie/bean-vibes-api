const httpStatus = require('http-status');
const { Comment } = require('../models');
const ApiError = require('../utils/error.response');
const pick = require('../utils/pick');

/**
 * Create a comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */
const createComment = async (commentBody) => {
  return Comment.create(commentBody);
};

/**
 * Query for comments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {boolean} [options.includeHidden] - Whether to include hidden comments
 * @returns {Promise<QueryResult>}
 */
const queryComments = async (filter, options) => {
  const { includeHidden, ...queryOptions } = options;
  
  // By default, exclude hidden comments unless explicitly requested
  if (!includeHidden) {
    filter.isHidden = { $ne: true };
  }
  
  const comments = await Comment.paginate(filter, queryOptions);
  return comments;
};

/**
 * Get comment by id
 * @param {ObjectId} id
 * @returns {Promise<Comment>}
 */
const getCommentById = async (id) => {
  return Comment.findById(id).populate('user', 'name email').populate('review', 'title');
};

/**
 * Update comment by id
 * @param {ObjectId} commentId
 * @param {Object} updateBody
 * @returns {Promise<Comment>}
 */
const updateCommentById = async (commentId, updateBody) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  Object.assign(comment, updateBody);
  await comment.save();
  return comment;
};

/**
 * Delete comment by id
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (commentId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  await Comment.findByIdAndDelete(commentId);
  return comment;
};

/**
 * Hide comment by id (admin only)
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const hideCommentById = async (commentId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  comment.isHidden = true;
  await comment.save();
  return comment;
};

/**
 * Unhide comment by id (admin only)
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const unhideCommentById = async (commentId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  comment.isHidden = false;
  await comment.save();
  return comment;
};

/**
 * Get comments by review id
 * @param {ObjectId} reviewId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getCommentsByReviewId = async (reviewId, options) => {
  const filter = { review: reviewId };
  return queryComments(filter, options);
};

/**
 * Get comments by user id
 * @param {ObjectId} userId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getCommentsByUserId = async (userId, options) => {
  const filter = { user: userId };
  return queryComments(filter, options);
};

module.exports = {
  createComment,
  queryComments,
  getCommentById,
  updateCommentById,
  deleteCommentById,
  hideCommentById,
  unhideCommentById,
  getCommentsByReviewId,
  getCommentsByUserId,
}; 