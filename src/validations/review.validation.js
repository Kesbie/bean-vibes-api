const Joi = require('joi');
const { objectId, file } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    place: Joi.string().custom(objectId).required(),
    title: Joi.string().required().min(1).max(200).required(),
    content: Joi.string().required().min(1).max(2000).required(),
    slug: Joi.string().max(200),
    photos: Joi.array().items(Joi.object().keys().custom(file)),
    isAnonymous: Joi.boolean(),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    place: Joi.string().custom(objectId),
    user: Joi.string().custom(objectId),
    isAnonymous: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    includeHidden: Joi.boolean(),
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().min(1).max(200),
      content: Joi.string().min(1).max(2000),
      slug: Joi.string().max(200),
      photos: Joi.array().items(Joi.object().keys().custom(file)),
      isAnonymous: Joi.boolean(),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
};

const hideReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
};

const unhideReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
};

const getReviewsByPlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReviewsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const searchReviews = {
  query: Joi.object().keys({
    q: Joi.string().required().min(1),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAnonymousReviews = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const addReactionToReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    reactionId: Joi.string().custom(objectId).required(),
  }),
};

const removeReactionFromReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    reactionId: Joi.string().custom(objectId).required(),
  }),
};

const addCommentToReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    content: Joi.string().required().min(1).max(1000),
  }),
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  hideReview,
  unhideReview,
  getReviewsByPlace,
  getReviewsByUser,
  searchReviews,
  getAnonymousReviews,
  addReactionToReview,
  removeReactionFromReview,
  addCommentToReview,
}; 