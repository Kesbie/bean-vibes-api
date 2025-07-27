const express = require('express');
const validate = require('../../middlewares/validate');
const { wardValidation } = require('../../validations');
const { wardController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(validate(wardValidation.getWards), wardController.getWards);

router
  .route('/search')
  .get(validate(wardValidation.searchWards), wardController.searchWards);

router
  .route('/district/:districtId')
  .get(validate(wardValidation.getWardsByDistrict), wardController.getWardsByDistrict);

router
  .route('/slug/:slug')
  .get(validate(wardValidation.getWardBySlug), wardController.getWardBySlug);

router
  .route('/:wardId')
  .get(validate(wardValidation.getWard), wardController.getWard);

module.exports = router; 