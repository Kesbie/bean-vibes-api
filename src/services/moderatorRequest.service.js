const httpStatus = require('http-status');
const { ModeratorRequest, User } = require('../models');
const ApiError = require('../utils/error.response');
const pick = require('../utils/pick');

/**
 * Create a moderator request
 * @param {Object} requestBody
 * @returns {Promise<ModeratorRequest>}
 */
const createModeratorRequest = async (requestBody) => {
  // Check if user already has a pending request
  const existingRequest = await ModeratorRequest.findOne({
    user: requestBody.user,
    status: 'pending',
  });

  if (existingRequest) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You already have a pending moderator request'
    );
  }

  // Check if user is already a moderator
  const user = await User.findById(requestBody.user);
  if (user && user.role === 'moderator') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are already a moderator'
    );
  }

  return ModeratorRequest.create(requestBody);
};

/**
 * Query for moderator requests
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryModeratorRequests = async (filter, options) => {
  const result = await ModeratorRequest.paginate(filter, {
    ...options,
    populate: [
      { path: 'user', select: 'name email' },
      { path: 'reviewedBy', select: 'name email' },
    ],
  });
  return result;
};

/**
 * Get moderator request by id
 * @param {ObjectId} id
 * @returns {Promise<ModeratorRequest>}
 */
const getModeratorRequestById = async (id) => {
  return ModeratorRequest.findById(id)
    .populate('user', 'name email')
    .populate('reviewedBy', 'name email');
};

/**
 * Get moderator request by user id
 * @param {ObjectId} userId
 * @returns {Promise<ModeratorRequest>}
 */
const getModeratorRequestByUser = async (userId) => {
  return ModeratorRequest.findOne({ user: userId })
    .populate('user', 'name email')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Update moderator request by id
 * @param {ObjectId} requestId
 * @param {Object} updateBody
 * @returns {Promise<ModeratorRequest>}
 */
const updateModeratorRequestById = async (requestId, updateBody) => {
  const request = await getModeratorRequestById(requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Moderator request not found');
  }

  Object.assign(request, updateBody);
  await request.save();
  return request;
};

/**
 * Delete moderator request by id
 * @param {ObjectId} requestId
 * @returns {Promise<ModeratorRequest>}
 */
const deleteModeratorRequestById = async (requestId) => {
  const request = await getModeratorRequestById(requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Moderator request not found');
  }

  await ModeratorRequest.findByIdAndDelete(requestId);
  return request;
};

/**
 * Review moderator request (approve/reject)
 * @param {ObjectId} requestId
 * @param {Object} reviewData
 * @param {string} reviewData.status - 'approved' or 'rejected'
 * @param {string} reviewData.rejectionReason - Required if status is 'rejected'
 * @param {ObjectId} reviewerId
 * @returns {Promise<ModeratorRequest>}
 */
const reviewModeratorRequest = async (requestId, reviewData, reviewerId) => {
  const request = await getModeratorRequestById(requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Moderator request not found');
  }

  if (request.status !== 'pending') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This request has already been reviewed'
    );
  }

  // Validate rejection reason
  if (reviewData.status === 'rejected' && !reviewData.rejectionReason) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Rejection reason is required when rejecting a request'
    );
  }

  // Update request
  request.status = reviewData.status;
  request.reviewedBy = reviewerId;
  request.reviewedAt = new Date();

  if (reviewData.status === 'rejected') {
    request.rejectionReason = reviewData.rejectionReason;
  }

  await request.save();

  // If approved, update user role to moderator
  if (reviewData.status === 'approved') {
    await User.findByIdAndUpdate(request.user, {
      role: 'moderator',
    });
  }

  return request;
};

/**
 * Get pending moderator requests
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getPendingModeratorRequests = async (options) => {
  return queryModeratorRequests({ status: 'pending' }, options);
};

/**
 * Get moderator requests by status
 * @param {string} status
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getModeratorRequestsByStatus = async (status, options) => {
  return queryModeratorRequests({ status }, options);
};

/**
 * Check if user can submit moderator request
 * @param {ObjectId} userId
 * @returns {Promise<Object>}
 */
const canUserSubmitRequest = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if user is already a moderator
  if (user.role === 'moderator') {
    return {
      canSubmit: false,
      reason: 'You are already a moderator',
    };
  }

  // Check for pending request
  const pendingRequest = await ModeratorRequest.findOne({
    user: userId,
    status: 'pending',
  });

  if (pendingRequest) {
    return {
      canSubmit: false,
      reason: 'You already have a pending request',
    };
  }

  return {
    canSubmit: true,
    reason: null,
  };
};

module.exports = {
  createModeratorRequest,
  queryModeratorRequests,
  getModeratorRequestById,
  getModeratorRequestByUser,
  updateModeratorRequestById,
  deleteModeratorRequestById,
  reviewModeratorRequest,
  getPendingModeratorRequests,
  getModeratorRequestsByStatus,
  canUserSubmitRequest,
}; 