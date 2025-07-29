const express = require('express');
const validate = require('../../middlewares/validate');
const { districtValidation } = require('../../validations');
const { districtController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(validate(districtValidation.getDistricts), districtController.getDistricts);

router
  .route('/slug/:slug')
  .get(validate(districtValidation.getDistrictBySlug), districtController.getDistrictBySlug);

router
  .route('/:districtId')
  .get(validate(districtValidation.getDistrict), districtController.getDistrict);

module.exports = router; 