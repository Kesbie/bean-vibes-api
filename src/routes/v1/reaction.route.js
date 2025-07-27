const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { reactionValidation } = require('../../validations');
const { reactionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(reactionValidation.createReaction), reactionController.createReaction)
  .get(validate(reactionValidation.getReactions), reactionController.getReactions);

router
  .route('/toggle')
  .post(auth(), validate(reactionValidation.toggleReaction), reactionController.toggleReaction);

router
  .route('/count')
  .get(validate(reactionValidation.getReactionCount), reactionController.getReactionCount);

router
  .route('/user/:userId')
  .get(validate(reactionValidation.getReactionsByUser), reactionController.getReactionsByUser);

router
  .route('/review/:reviewId')
  .get(validate(reactionValidation.getReactionsByReview), reactionController.getReactionsByReview);

router
  .route('/comment/:commentId')
  .get(validate(reactionValidation.getReactionsByComment), reactionController.getReactionsByComment);

router
  .route('/type/:type')
  .get(validate(reactionValidation.getReactionsByType), reactionController.getReactionsByType);

router
  .route('/:reactionId')
  .get(validate(reactionValidation.getReaction), reactionController.getReaction)
  .patch(auth(), validate(reactionValidation.updateReaction), reactionController.updateReaction)
  .delete(auth(), validate(reactionValidation.deleteReaction), reactionController.deleteReaction);

module.exports = router; 