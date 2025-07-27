const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReaction = {
  body: Joi.object().keys({
    review: Joi.string().custom(objectId),
    comment: Joi.string().custom(objectId),
    type: Joi.string().valid('like', 'dislike').required(),
  }).or('review', 'comment'),
};

const getReactions = {
  query: Joi.object().keys({
    review: Joi.string().custom(objectId),
    comment: Joi.string().custom(objectId),
    user: Joi.string().custom(objectId),
    type: Joi.string().valid('like', 'dislike'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReaction = {
  params: Joi.object().keys({
    reactionId: Joi.string().custom(objectId).required(),
  }),
};

const updateReaction = {
  params: Joi.object().keys({
    reactionId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      type: Joi.string().valid('like', 'dislike'),
    })
    .min(1),
};

const deleteReaction = {
  params: Joi.object().keys({
    reactionId: Joi.string().custom(objectId).required(),
  }),
};

const getReactionsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReactionsByReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReactionsByComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReactionsByType = {
  params: Joi.object().keys({
    type: Joi.string().valid('like', 'dislike').required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const toggleReaction = {
  body: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
    commentId: Joi.string().custom(objectId),
    type: Joi.string().valid('like', 'dislike').required(),
  }).or('reviewId', 'commentId'),
};

const getReactionCount = {
  query: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
    commentId: Joi.string().custom(objectId),
    type: Joi.string().valid('like', 'dislike').required(),
  }).or('reviewId', 'commentId'),
};

module.exports = {
  createReaction,
  getReactions,
  getReaction,
  updateReaction,
  deleteReaction,
  getReactionsByUser,
  getReactionsByReview,
  getReactionsByComment,
  getReactionsByType,
  toggleReaction,
  getReactionCount,
}; 