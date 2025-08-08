const multer = require('multer');
const { fileFilter } = require('../middlewares/fileFilter');

// Configure memory storage for Cloudinary integration
const memoryStorage = multer.memoryStorage();

// Upload to Cloudinary function
const uploadToCloudinary = async (file, folder = 'bean-vibes') => {
  try {
    const { cloudinary } = require('./cloudinary');
    const { Readable } = require('stream');
    
    // Convert buffer to stream
    const stream = Readable.from(file.buffer);
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
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

// Configure multer with memory storage for Cloudinary
const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10, // Maximum 10 files per request
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload,
  uploadToCloudinary
}; 