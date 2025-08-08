const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createComment = {
  body: Joi.object().keys({
    review: Joi.string().custom(objectId).required(),
    content: Joi.string().required().min(1).max(1000),
  }),
};

const getComments = {
  query: Joi.object().keys({
    review: Joi.string().custom(objectId),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    includeHidden: Joi.boolean(),
  }),
};

const getComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId).required(),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      content: Joi.string().min(1).max(1000),
    })
    .min(1),
};

const deleteComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId).required(),
  }),
};

const hideComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId).required(),
  }),
};

const unhideComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId).required(),
  }),
};

const getCommentsByReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCommentsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
  hideComment,
  unhideComment,
  getCommentsByReview,
  getCommentsByUser,
}; 