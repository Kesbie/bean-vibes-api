const { NOT_FOUND } = require('../utils/error.response');
const { Media } = require('../models');

const createMedia = async (mediaBody) => {
  const media = await Media.create(mediaBody);
  return media;
};

const getMediaById = async (id) => {
  const media = await Media.findById(id);
  if (!media) {
    throw new NOT_FOUND('Media not found');
  }
  return media;
};

const deleteMediaById = async (id) => {
  const media = await Media.findByIdAndDelete(id);
  return media;
};

module.exports = {
  createMedia,
  getMediaById,
  deleteMediaById,
};