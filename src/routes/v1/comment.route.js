const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { commentValidation } = require('../../validations');
const { commentController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(commentValidation.createComment), commentController.createComment)
  .get(validate(commentValidation.getComments), commentController.getComments);

router
  .route('/:commentId')
  .get(validate(commentValidation.getComment), commentController.getComment)
  .patch(auth(), validate(commentValidation.updateComment), commentController.updateComment)
  .delete(auth(), validate(commentValidation.deleteComment), commentController.deleteComment);

router
  .route('/review/:reviewId')
  .get(validate(commentValidation.getCommentsByReview), commentController.getCommentsByReview);

router
  .route('/user/:userId')
  .get(validate(commentValidation.getCommentsByUser), commentController.getCommentsByUser);

module.exports = router; 