const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { reviewValidation } = require('../../validations');
const { reviewController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(reviewValidation.createReview), reviewController.createReview)
  .get(validate(reviewValidation.getReviews), reviewController.getReviews);

router
  .route('/search')
  .get(validate(reviewValidation.searchReviews), reviewController.searchReviews);

router
  .route('/anonymous')
  .get(validate(reviewValidation.getAnonymousReviews), reviewController.getAnonymousReviews);

router
  .route('/place/:placeId')
  .get(validate(reviewValidation.getReviewsByPlace), reviewController.getReviewsByPlace);

router
  .route('/user/:userId')
  .get(validate(reviewValidation.getReviewsByUser), reviewController.getReviewsByUser);

router
  .route('/:reviewId')
  .get(validate(reviewValidation.getReview), reviewController.getReview)
  .patch(auth(), validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(auth(), validate(reviewValidation.deleteReview), reviewController.deleteReview);

router
  .route('/:reviewId/reactions')
  .post(auth(), validate(reviewValidation.addReactionToReview), reviewController.addReactionToReview)
  .delete(auth(), validate(reviewValidation.removeReactionFromReview), reviewController.removeReactionFromReview);

router
  .route('/:reviewId/comments')
  .post(auth(), validate(reviewValidation.addCommentToReview), reviewController.addCommentToReview);

module.exports = router; 