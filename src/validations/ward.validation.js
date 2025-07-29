const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getWards = {
  query: Joi.object().keys({
    name: Joi.string(),
    slug: Joi.string(),
    district_id: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getWard = {
  params: Joi.object().keys({
    wardId: Joi.string().custom(objectId),
  }),
};

const getWardBySlug = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const getWardsByDistrict = {
  params: Joi.object().keys({
    districtId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const searchWards = {
  query: Joi.object().keys({
    name: Joi.string(),
    slug: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  getWards,
  getWard,
  getWardBySlug,
  getWardsByDistrict,
  searchWards,
}; 