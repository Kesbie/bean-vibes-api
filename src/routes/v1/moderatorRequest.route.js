const express = require('express');
const { auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { moderatorRequestValidation } = require('../../validations');
const { moderatorRequestController } = require('../../controllers');

const router = express.Router();

// User routes (require authentication)
router
  .route('/')
  .post(auth(), validate(moderatorRequestValidation.createModeratorRequest), moderatorRequestController.createModeratorRequest)
  .get(auth('manageModeratorRequests'), validate(moderatorRequestValidation.getModeratorRequests), moderatorRequestController.getModeratorRequests);

router
  .route('/my-request')
  .get(auth(), moderatorRequestController.getMyModeratorRequest);

router
  .route('/can-submit')
  .get(auth(), moderatorRequestController.checkCanSubmitRequest);

// Admin/Moderator routes
router
  .route('/pending')
  .get(auth('manageModeratorRequests'), validate(moderatorRequestValidation.getModeratorRequests), moderatorRequestController.getPendingModeratorRequests);

router
  .route('/status/:status')
  .get(auth('manageModeratorRequests'), validate(moderatorRequestValidation.getModeratorRequestsByStatus), moderatorRequestController.getModeratorRequestsByStatus);

router
  .route('/:requestId')
  .get(auth('manageModeratorRequests'), validate(moderatorRequestValidation.getModeratorRequest), moderatorRequestController.getModeratorRequest)
  .patch(auth('manageModeratorRequests'), validate(moderatorRequestValidation.updateModeratorRequest), moderatorRequestController.updateModeratorRequest)
  .delete(auth('manageModeratorRequests'), validate(moderatorRequestValidation.deleteModeratorRequest), moderatorRequestController.deleteModeratorRequest);

router
  .route('/:requestId/review')
  .patch(auth('manageModeratorRequests'), validate(moderatorRequestValidation.reviewModeratorRequest), moderatorRequestController.reviewModeratorRequest);

module.exports = router; 