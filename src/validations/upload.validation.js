const Joi = require('joi');
const { objectId } = require('./custom.validation');

const uploadMedia = {
  body: Joi.object().keys({
    // File validation is handled by multer middleware
  }),
};

const getMedia = {
  params: Joi.object().keys({
    mediaId: Joi.string().custom(objectId),
  }),
};

const deleteMedia = {
  params: Joi.object().keys({
    mediaId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia,
}; 