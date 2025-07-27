const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getDistricts = {
  query: Joi.object().keys({
    name: Joi.string(),
    slug: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDistrict = {
  params: Joi.object().keys({
    districtId: Joi.string().custom(objectId),
  }),
};

const getDistrictBySlug = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

module.exports = {
  getDistricts,
  getDistrict,
  getDistrictBySlug,
}; 