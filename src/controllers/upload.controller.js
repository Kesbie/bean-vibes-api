const catchAsync = require('../utils/catchAsync');
const { status } = require('http-status');
const { mediaService } = require('../services');
const { upload } = require('../config/multer');
const path = require('path');
const { BAD_REQUEST, NOT_FOUND } = require('../utils/error.response');
const config = require('../config/config');
const ApiSuccess = require('../utils/success.response');

const uploadMedia = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new BAD_REQUEST('No files uploaded');
  }

  const uploadedMedia = [];

  for (const file of req.files) {
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

    const media = await mediaService.createMedia(mediaData);
    uploadedMedia.push(media);
  }

  new CREATED(uploadedMedia).send(res);
});

const getMedia = catchAsync(async (req, res) => {
  const media = await mediaService.getMediaById(req.params.mediaId);
  if (!media) {
    throw new NOT_FOUND('Media not found');
  }
  res.send(new ApiSuccess(status.OK, { media }));
});

const deleteMedia = catchAsync(async (req, res) => {
  const media = await mediaService.deleteMediaById(req.params.mediaId);
  if (!media) {
    throw new NOT_FOUND('Media not found');
  }
  res.json({
    status: 'success',
    message: 'Media deleted successfully',
  });
});

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia,
};
