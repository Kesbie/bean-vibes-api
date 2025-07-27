const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createModeratorRequest = {
  body: Joi.object().keys({
    reason: Joi.string().required().min(10).max(1000),
  }),
};

const getModeratorRequests = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getModeratorRequest = {
  params: Joi.object().keys({
    requestId: Joi.string().custom(objectId).required(),
  }),
};

const updateModeratorRequest = {
  params: Joi.object().keys({
    requestId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      reason: Joi.string().min(10).max(1000),
    })
    .min(1),
};

const deleteModeratorRequest = {
  params: Joi.object().keys({
    requestId: Joi.string().custom(objectId).required(),
  }),
};

const reviewModeratorRequest = {
  params: Joi.object().keys({
    requestId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('approved', 'rejected').required(),
    rejectionReason: Joi.when('status', {
      is: 'rejected',
      then: Joi.string().required().min(5).max(500),
      otherwise: Joi.string().optional(),
    }),
  }),
};

const getModeratorRequestsByStatus = {
  params: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected').required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createModeratorRequest,
  getModeratorRequests,
  getModeratorRequest,
  updateModeratorRequest,
  deleteModeratorRequest,
  reviewModeratorRequest,
  getModeratorRequestsByStatus,
}; 