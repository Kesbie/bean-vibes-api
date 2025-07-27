const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRating = {
  body: Joi.object().keys({
    place: Joi.string().custom(objectId).required(),
    user: Joi.string().custom(objectId).required(),
    drinkQuality: Joi.number().min(0).max(5).required(),
    location: Joi.number().min(0).max(5).required(),
    price: Joi.number().min(0).max(5).required(),
    service: Joi.number().min(0).max(5).required(),
    staffAttitude: Joi.number().min(0).max(5).optional(),
  }),
};

const updateRating = {
  params: Joi.object().keys({
    ratingId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    drinkQuality: Joi.number().min(0).max(5).optional(),
    location: Joi.number().min(0).max(5).optional(),
    price: Joi.number().min(0).max(5).optional(),
    service: Joi.number().min(0).max(5).optional(),
    staffAttitude: Joi.number().min(0).max(5).optional(),
  }),
};

const deleteRating = {
  params: Joi.object().keys({
    ratingId: Joi.string().custom(objectId).required(),
  }),
};

const getAverageRating = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
};

const getRatingBreakdown = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
};

const updateAverageRating = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
};

const getRatingsByPlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createRating,
  updateRating,
  deleteRating,
  getAverageRating,
  getRatingBreakdown,
  updateAverageRating,
  getRatingsByPlace,
}; 