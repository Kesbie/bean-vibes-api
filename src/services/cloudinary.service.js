const { cloudinary } = require('../config/cloudinary');
const { Readable } = require('stream');

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} folder - Cloudinary folder name
 * @param {Object} options - Additional upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadFile = async (fileBuffer, folder = 'bean-vibes', options = {}) => {
  try {
    const stream = Readable.from(fileBuffer);
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
          ...options
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image, video, raw)
 * @returns {Promise<Object>} Cloudinary deletion result
 */
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log('Successfully deleted from Cloudinary:', publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

/**
 * Get file info from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image, video, raw)
 * @returns {Promise<Object>} Cloudinary file info
 */
const getFileInfo = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.api.resource(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error('Error getting file info from Cloudinary:', error);
    throw error;
  }
};

/**
 * Transform image URL with Cloudinary transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Cloudinary transformations
 * @returns {string} Transformed URL
 */
const getTransformedUrl = (publicId, transformations = {}) => {
  try {
    return cloudinary.url(publicId, transformations);
  } catch (error) {
    console.error('Error generating transformed URL:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of file objects with buffer property
 * @param {string} folder - Cloudinary folder name
 * @param {Object} options - Additional upload options
 * @returns {Promise<Array>} Array of Cloudinary upload results
 */
const uploadMultipleFiles = async (files, folder = 'bean-vibes', options = {}) => {
  try {
    const uploadPromises = files.map(file => uploadFile(file.buffer, folder, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple files to Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getFileInfo,
  getTransformedUrl,
  uploadMultipleFiles
}; 