const catchAsync = require('../utils/catchAsync');
const { status } = require('http-status');
const { mediaService } = require('../services');
const { upload } = require('../config/multer');
const path = require('path');
const { BAD_REQUEST, NOT_FOUND } = require('../utils/error.response');
const config = require('../config/config');
const { CREATED, OK } = require('../utils/success.response');

const uploadMedia = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new BAD_REQUEST('No files uploaded. Please ensure you are sending files with the field name "files"');
  }

  const uploadedMedia = [];

  for (const file of req.files) {
    console.log('Processing file:', file.originalname, 'Size:', file.size);

    // Determine file type based on extension
    const ext = path.extname(file.originalname).toLowerCase();
    const imageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const videoTypes = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];

    let mediaType;
    if (imageTypes.includes(ext)) {
      mediaType = 'image';
    } else if (videoTypes.includes(ext)) {
      mediaType = 'video';
    } else {
      throw new BAD_REQUEST(`Unsupported file type: ${file.originalname}`);
    }

    // Create media object
    const mediaData = {
      type: mediaType,
      size: file.size,
      url: `${config.env === 'production' ? process.env.DOMAIN : 'http://localhost:8000'}/uploads/${file.filename}`,
      originalName: file.originalname,
      filename: file.filename,
    };

    console.log('Creating media with data:', mediaData);
    const media = await mediaService.createMedia(mediaData);
    uploadedMedia.push(media);
  }

  console.log('Successfully uploaded', uploadedMedia.length, 'files');
  new CREATED(uploadedMedia).send(res);
});

const getMedia = catchAsync(async (req, res) => {
  const media = await mediaService.getMediaById(req.params.mediaId);
  if (!media) {
    throw new NOT_FOUND('Media not found');
  }
  new OK(media).send(res);
});

const deleteMedia = catchAsync(async (req, res) => {
  const media = await mediaService.deleteMediaById(req.params.mediaId);
  if (!media) {
    throw new NOT_FOUND('Media not found');
  }
  new OK(media).send(res);
});

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia,
};
