const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { upload } = require('../../config/multer');
const { uploadController } = require('../../controllers');
const { uploadValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    auth('uploadMedia'),
    upload.array('files', 10), // Allow up to 10 files with field name 'files'
    uploadController.uploadMedia
  );

router
  .route('/:mediaId')
  .get(
    validate(uploadValidation.getMedia),
    uploadController.getMedia
  )
  .delete(
    auth('uploadMedia'),
    validate(uploadValidation.deleteMedia),
    uploadController.deleteMedia
  );

module.exports = router; 