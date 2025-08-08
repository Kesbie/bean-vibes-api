const catchAsync = require('../utils/catchAsync');
const { status } = require('http-status');
const { mediaService, cloudinaryService } = require('../services');
const { upload } = require('../config/multer');
const path = require('path');
const { BAD_REQUEST, NOT_FOUND } = require('../utils/error.response');
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

    try {
      // Upload to Cloudinary using the service
      const cloudinaryResult = await cloudinaryService.uploadFile(file.buffer, 'bean-vibes');
      console.log("--------------------------------")
      console.log('Cloudinary upload result:', cloudinaryResult);
      console.log("--------------------------------")

      console.log("--------------------------------")
      console.log(file)
      console.log("--------------------------------")

      // console.log('Cloudinary upload result:', {
      //   public_id: cloudinaryResult.public_id,
      //   url: cloudinaryResult.secure_url,
      //   format: cloudinaryResult.format
      // });

      // // Create media object with Cloudinary data
      const mediaData = {
        type: file.mimetype,
        size: file.size,
        url: cloudinaryResult.secure_url,
        originalName: file.originalname,
        name: file.originalname,
        // filename: cloudinaryResult.public_id,
        // cloudinaryId: cloudinaryResult.public_id,
        // cloudinaryUrl: cloudinaryResult.secure_url,
        format: cloudinaryResult.format,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        bytes: cloudinaryResult.bytes
      };

      // console.log('Creating media with data:', mediaData);
      // const media = await mediaService.createMedia(mediaData);
      uploadedMedia.push(mediaData);
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      throw new BAD_REQUEST(`Failed to upload file ${file.originalname}: ${error.message}`);
    }
  }

  console.log('Successfully uploaded', uploadedMedia.length, 'files to Cloudinary');
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
  const media = await mediaService.getMediaById(req.params.mediaId);
  if (!media) {
    throw new NOT_FOUND('Media not found');
  }

  // Delete from Cloudinary
  try {
    await cloudinaryService.deleteFile(media.cloudinaryId, media.type);
    console.log('Successfully deleted from Cloudinary:', media.cloudinaryId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new BAD_REQUEST('Failed to delete file from Cloudinary');
  }

  const deletedMedia = await mediaService.deleteMediaById(req.params.mediaId);
  new OK(deletedMedia).send(res);
});

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia,
};
