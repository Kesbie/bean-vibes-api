const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const profileValidation = require('../../validations/profile.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('getUser'), validate(), userController.getProfile)
  .patch(auth('updateProfile'), validate(profileValidation.updateProfile), userController.updateProfile);

router
  .route('/change-password')
  .post(auth('changePassword'), validate(profileValidation.changePassword), userController.changePassword);

module.exports = router;
