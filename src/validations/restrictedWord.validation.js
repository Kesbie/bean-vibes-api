const Joi = require('joi');
const { RESTRICTED_WORD_TYPES } = require('../constants/restrictedWordTypes');
const { objectId } = require('./custom.validation');

const createRestrictedWord = {
  body: Joi.object().keys({
    word: Joi.string().required(),
    replacement: Joi.string(),
    type: Joi.string().valid(...Object.values(RESTRICTED_WORD_TYPES)).default(RESTRICTED_WORD_TYPES.HIDE),
  }),
};

const queryRestrictedWords = {
  query: Joi.object().keys({
    word: Joi.string(),
    type: Joi.string().valid(...Object.values(RESTRICTED_WORD_TYPES)),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteRestrictedWord = {
  params: Joi.object().keys({
    restrictedWordId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRestrictedWord,
  queryRestrictedWords,
  deleteRestrictedWord,
};